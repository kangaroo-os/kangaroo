class AbstractFileRepository
  attr_reader :current_user, :name_search

  # Expects params to include a search key, with the file name of search
  def initialize(current_user, params)
    @current_user = current_user
    @name_search = params[:name_search].presence || nil
  end

  def query
    if name_search
      current_user.abstract_files.search_by_name(name_search)
    else
      current_user.abstract_files
    end
  end
end