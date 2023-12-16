import React, { useEffect, useState } from 'react'
import "./style.scss"
import Card from "../../components/cards/Card"
import {fetchData} from '../../store/fetchApi'
import { useParams } from 'react-router-dom'


function ResultPage() {
const params = useParams()
const [data, setData] = useState([])

useEffect(()=>{
  fetchData(`/search/multi?query=${params.query}`).then(res=>setData(res.results))
},[params])


  return (
    <div className='search-container'>
        <div className='search-filter'>
            <h1 className='search-heading'>Search Results of "{params.query}"</h1>
        </div>
        <div className='search-results'>
           {data?.map((data)=> {
           if(data.media_type==="person"){
            return
           }else{
          return <Card data={data} />
           }})}
        </div>
    </div>
  )
}

export default ResultPage;