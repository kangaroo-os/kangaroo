class FolderFilesController < AbstractFilesController 
  before_action :user_authorized?, only: [:get_folder_files]

  def create 
    params.require(:path)
    name = "untitled folder"
    
    file = FolderFile.new({
      path: "users/#{current_user.id}/#{name}",
      name: name, 
      file_type: "folder", 
      owner_id: current_user.id, 
      size: 0, 
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