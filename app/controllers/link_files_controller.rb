class LinkFilesController < AbstractFilesController

  require "open-uri"
  require "uri"
  
  before_action :user_authorized?, only: [:show, :destroy]
  before_action :authenticate_user!

  # POST /link_file/
  def create 
    params.require(:url)
    name = get_website_title(params[:url])
    
    file = LinkFile.new({
      path: "users/#{current_user.id}/#{name}", 
      url: params[:url],
      name: name, 
      file_type: "link",
      owner_id: current_user.id,
      size: 0
    })
    

    if file.save!
      file.users << current_user
      render json: {file: AbstractFileSerializer.new(file).serializable_hash}, status: :ok
    else
      render json: {error: "File not saved"}, status: :unprocessable_entity
    end

  end
  
  # GET /link_files
  def index 
    render json: { files: current_user.link_files }, status: :ok
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
    Nokogiri::HTML(URI.open(url)).css('title').text
    rescue
      begin
        Nokogiri::HTML(URI.open(URI.join url, '/')).css('title').text
      rescue
        "untitled website"
      end
  end
end
