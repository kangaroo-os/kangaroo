class ApplicationSerializer
  include FastJsonapi::ObjectSerializer

  def serializable_hash
    data = super

    if data[:data].is_a? Hash
      data[:data][:attributes]

    elsif data[:data].is_a? Array
      data[:data].map{ |x| x[:attributes] }

    elsif data[:data] == nil
      nil

    else
      data
    end
  end

end
