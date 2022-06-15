class AbstractFileSerializer < ApplicationSerializer
  include JSONAPI::Serializer
  attributes :id, :name, :path, :file_type, :size, :icon_url, :public_share_url, :publicly_accessible

end
