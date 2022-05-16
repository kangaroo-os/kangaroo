class AbstractFilesController < ApplicationController
  
  before_action :authenticate_user!
  before_action :user_authorized?, only: [:destroy]

  def index
    render json: { files: current_user.abstract_files }, status: :ok
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
    file = AbstractFile.find(params[:id])
    if file
      file.update(abstract_file_params)
      render json: { message: "File updated" }, status: :ok
    else
      render json: {error: "File not found"}, status: :not_found
    end
  end

   
  private 

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