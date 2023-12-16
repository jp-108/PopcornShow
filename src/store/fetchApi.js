import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL
const TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN

const headers = {
    Authorization : "bearer " + TOKEN
}

const fetchData = async(url, params)=>{ 
    try {
       const data = await axios.get(BASE_URL + url, {
           headers, 
           params
       })
       return data.data
   } catch (error) {
       console.log(error)
   }
}

const fetchApi = createAsyncThunk('home/fetchApi', fetchData)
const fetchGenre = createAsyncThunk('home/fetchGenre', fetchData)

export default fetchApi;
export {fetchData, fetchGenre};