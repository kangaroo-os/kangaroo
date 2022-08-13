import api from '../../helpers/api'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import React from 'react'

const ProxiedFile = () => {
  const [url, setUrl] = useState('')
  let { share_id } = useParams()

  useEffect(() => {
    api
      .get(`${location.origin}/joey_backend/${share_id}`)
      .then((res) => {
        const data = res.data
        return data.blob()
      })
      .then((res) => {
        setUrl(URL.createObjectURL(res.data))
      })
  }, [])

  return <iframe src={url} />
}

export default ProxiedFile
