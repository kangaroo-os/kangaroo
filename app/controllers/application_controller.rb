class ApplicationController < ActionController::Base

  def login 
    if params[:password] == "nipples"
      render "desktop"
    end
  end

  def desktop
  end 

end
