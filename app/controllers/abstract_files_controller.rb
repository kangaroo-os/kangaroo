class AbstractFilesController < ApplicationController

  before_action :authenticate_user!, except: [:serialize_shared_files, :get_proxied_file]
  before_action :reject_unless_authorized, only: [:show, :destroy, :update, :make_publicly_accessible, :move_file]

  def index
    desktop_files = current_user.abstract_files.filter do |file|
      file.path == "users/#{current_user.id}/#{file.name}"
    end

    serialized_files = serialize_files(desktop_files)

    render json: { files: serialized_files, path: "users/#{current_user.id}" }, status: :ok
  end

  def show
    file = AbstractFile.find(params[:id])
    if file
      render json: { url: file.url }, status: :ok
    else
      render json: { error: "File not found" }, status: :not_found
    end
  end

  def destroy 
    file = AbstractFile.find(params[:id])
    return render json: {error: 'File not found'}, status: :not_found unless file.present?

    ApplicationRecord.transaction do
      if file.file_type == 'folder'
        children = AbstractFile.where('path LIKE ?', "#{file.path}/%")
        children.each(&:destroy!)
      end
      file.destroy!
    rescue ActiveRecord::RecordInvalid
      return render json: { error: 'Could not delete file' }, status: :unprocessable_entity
    end

    render json: { message: 'File deleted' }, status: :ok
  end

  def update
    file = AbstractFile.find(abstract_file_params[:id])
    new_path = abstract_file_params[:path]
    return render json: {error: 'File not found'}, status: :not_found unless file.present?
    return render json: {error: 'Illegal path'}, status: :unprocessable_entity unless new_path.starts_with?("users/#{current_user.id}")

    ApplicationRecord.transaction do
      old_path = file.path
      file.update!(path: new_path)
      associated_files = AbstractFile.where(owner_id: current_user.id).where('path LIKE ?', "#{old_path}/%")
      associated_files.find_each do |subfile|
        subfile.update!(path: "#{new_path}/#{subfile.name}")
      end
    end
    render json: { file: serialize_file(file) }, status: :ok
  rescue ActiveRecord::RecordInvalid
    render json: { error: 'Validation failed' }, status: :unprocessable_entity
  end

  def move_file
    return render json: {error: 'File not found'}, status: :not_found unless params.has_key?(:id)
    return render json: {error: 'File cannot be moved to this location'}, statue: :unprocessable_entity unless params.has_key?(:folder_id)
    file = current_user.abstract_files.find(params[:id])
    if params[:folder_id] === '0'
      file.folder = nil 
      file.path = "users/#{current_user.id}/#{file.name}"
    else 
      folder = current_user.folder_files.find(params[:folder_id])
      file.folder = folder
      file.path = "#{folder.path}/#{file.name}"
    end
    if file.save!
      render json: { message: 'File moved' }, status: :ok
    else
      render json: { error: 'File not moved' }, status: :unprocessable_entity
    end

  end

  def make_publicly_accessible
    return render json: {error: "Missing is_public parameter"}, status: :unprocessable_entity unless params.has_key?(:is_public)
    file = current_user.abstract_files.find(params[:id])
    if file
      file.update(is_root_shareable: params[:is_public])
      recursively_make_children_shareable(file, params[:is_public])
      file.save!
      render json: { file: file }, status: :ok
    else
      render json: {error: "File not found"}, status: :not_found
    end
  end

  def serialize_shared_files
    return render json: {error: "Missing share_id parameter"}, status: :unprocessable_entity unless params.has_key?(:share_id)
    root_proxied_file = AbstractFile.where(public_share_url: params[:share_id], is_shareable: true).first
    return render json: {error: "Files not found"}, status: :not_found unless root_proxied_file 
    if root_proxied_file.type == "FolderFile"
      render json: { root_file: serialize_file(root_proxied_file), files: serialize_files(root_proxied_file.children_files) }, status: :ok 
    else
      render json: { url: root_proxied_file.url }, status: :ok
    end
  end

  def get_proxied_file
    root_proxied_file = AbstractFile.find_by(public_share_url: params[:share_id])
    # return authenticate_user! unless root_proxied_file.is_shareable
    if session['warden.user.user.key'].present?
      warden_key = session['warden.user.user.key']
      user = User.find(warden_key[0][0])
      user = nil unless warden_key[1] == user.encrypted_password[0, 29]
    end

    if user_authorized?(user) || root_proxied_file.is_shareable
      send_data root_proxied_file.file.download, filename: root_proxied_file.name, content_type: root_proxied_file.file_type, :disposition => 'inline'
    else
      render json: { error: 'Unauthorized access' }, status: :unauthorized
    end
  end

  private

  def abstract_file_params
    params.permit(%w[
      id
      path 
    ])
  end

  def recursively_make_children_shareable(file, is_public)
    file.update!(is_shareable: is_public) unless file.is_root_shareable && !is_public
    if file.type == "FolderFile"
      file.children_files.each do |child|
        recursively_make_children_shareable(child, is_public)
      end
    end
  end

  protected

  def user_authorized?(user = current_user)
    if params.has_key?(:share_id)
      file = AbstractFile.find_by(public_share_url: params[:share_id])
      return file && (file.is_shareable || user&.abstract_file_ids&.include?(file.id))
    elsif params.has_key?(:id)
      return user.abstract_file_ids.include?(params[:id].to_i)
    end
    return false
  end

  def reject_unless_authorized
    unless user_authorized?
      render json: { error: "You are not authorized to access this file."}, status: :unauthorized
    end
  end

  def serialize_file(file)
    AbstractFileSerializer.new(file).serializable_hash
  end

  def serialize_files(files)
    files.map { |file| serialize_file(file) }
  end
end
