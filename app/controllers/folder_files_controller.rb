class FolderFilesController < AbstractFilesController 
  before_action :user_authorized?, only: [:get_folder_files]

  def create 
    params.require(:id)
    name = 'untitled folder'
    id = params[:id]

    if id == '0'
      path = "users/#{current_user.id}/#{name}"
      folder_id = nil
    else
      path = AbstractFile.find(id).path + "/#{name}"
      folder_id = id
    end

    file = FolderFile.new({
      path: path,
      name: name,
      file_type: "folder",
      owner_id: current_user.id,
      size: 0, 
      folder_id: folder_id,
    })
    if file.save!
      file.users << current_user
      render json: {file: file}, status: :ok
    else
      render json: {error: "File not saved"}, status: :unprocessable_entity
    end
  end

  def get_folder_files
    params.require(:id)
    folder = current_user.folder_files.find(params[:id])
    if folder.present?
      files = folder.children_files
      serialized_files = serialize_files(files)
      render json: { files: serialized_files }, status: :ok
    else
      render json: { error: "Folder not found" }, status: :not_found
    end
  end

  
end