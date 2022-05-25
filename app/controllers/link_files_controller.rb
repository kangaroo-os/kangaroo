class LinkFilesController < ApplicationController

  require "open-uri"
  require "uri"
  
  before_action :user_authorized?, only: [:show, :destroy]
  before_action :authenticate_user!

  # POST /link_file/
  def create 
    params.require(:path)
    name = get_website_title(params[:path])
    
    file = LinkFile.new({
      path: params[:path], 
      name: name, 
      file_type: "link", 
      user_id: current_user.id, 
      size: 0
    })
    
    if file.save!
      render json: {file: file}, status: :ok
    else
      render json: {error: "File not saved"}, status: :unprocessable_entity
    end

  end
  
  # GET /link_files
  def index 
    render json: { files: current_user.link_files }, status: :ok
  end

  # GET /link_files/:id
  def show
    render json: { url: url }
  end

  # DELETE /cloud_files/:id
  def destroy 
    file = LinkFile.find(params[:id])
    if file
      file.destroy!
      render json: { message: "File deleted" }, status: :ok
    else
      render json: {error: "File not found"}, status: :not_found
    end
  end

  
  private

  def get_website_title(url)
    Nokogiri::HTML(URI.open(url)).css('title').text || "Untitled Website"
  end

  def user_authorized?
    if params.has_key?(:id)
      if current_user.cloud_file_ids.include?(params[:id].to_i)
        return true
      else
        render json: { error: "You are not authorized to access this file."}, status: :unauthorized
      end
    end
  end



end
