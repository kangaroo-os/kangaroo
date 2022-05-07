class RegistrationsController < Devise::RegistrationsController

  # POST /signup
  def create 
    binding.pry
    super 
  end

end