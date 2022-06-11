class FolderFilesController < ApplicationController
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
  
end