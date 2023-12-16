import React, { useEffect, useState } from 'react'
import "./style.scss"
import Card from "../../components/cards/Card"
import {fetchData} from '../../store/fetchApi'
import { useParams } from 'react-router-dom'


function ExplorePage() {
const params = useParams()
const [data, setData] = useState([])

useEffect(()=>{
  fetchData(`/discover/${params.mediaType}`).then(res=>setData(res.results))
},[params])


  return (
    <div className='explore-container'>
        <div className='explore-filter'>
            <h1 className='explore-heading'>Popular {params.mediaType==="tv"?"TV Shows":"Movies"}</h1>
        </div>
        <div className='explore-results'>
           {data?.map((data)=> <React.Fragment key={data.id}> <Card data={data} mediaType={params.mediaType} /> </React.Fragment>)}
        </div>
    </div>
  )
}

export default ExplorePage