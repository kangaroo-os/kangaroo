class AbstractFilesController < ApplicationController
  
  before_action :authenticate_user!
  before_action :user_authorized?, only: [:show, :destroy, :update]

  def index
    desktop_files = current_user.abstract_files.filter do |file|
      file.path == "users/#{current_user.id}/#{file.name}"
    end

    serialized_files = desktop_files.map { |f| AbstractFileSerializer.new(f).serializable_hash }

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

  def get_folder_files
    params.require(:key)
    files = AbstractFile.where(owner_id: current_user.id).where("path LIKE ?", "#{params[:key]}%")
    files = files.filter do |file|
      file.path == "#{params[:key]}/#{file.name}"
    end
    serialized_files = files.map { |f| AbstractFileSerializer.new(f).serializable_hash }
    render json: { files: serialized_files }
  end

  private

  def abstract_file_params
    params.permit(%w[
      id
      path 
    ])
  end

  def user_authorized?
    if params.has_key?(:id)
      if current_user.abstract_file_ids.include?(params[:id].to_i)
        return true
      else
        render json: { error: "You are not authorized to access this file."}, status: :unauthorized
      end
    end
  end


end