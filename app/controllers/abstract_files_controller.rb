class AbstractFilesController < ApplicationController
  
  before_action :authenticate_user!
  before_action :user_authorized?, only: [:show, :destroy, :update, :make_publicly_accessible, :move_file]

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
    if file
      file.destroy!
      render json: { message: "File deleted" }, status: :ok
    else
      render json: {error: "File not found"}, status: :not_found
    end
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
    render json: { message: 'File updated' }, status: :ok
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

  def user_authorized?
    if params.has_key?(:id)
      if current_user.abstract_file_ids.include?(params[:id].to_i)
        return true
      else
        render json: { error: "You are not authorized to access this file."}, status: :unauthorized
      end
    end
  end

  def serialize_files(files)
    files.map { |f| AbstractFileSerializer.new(f).serializable_hash }
  end
end