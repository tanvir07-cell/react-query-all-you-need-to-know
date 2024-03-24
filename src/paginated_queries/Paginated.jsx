import React, { useState } from 'react'
import {useQuery} from "@tanstack/react-query"

const getPosts = async({queryKey})=>{
    const response = await fetch(`https://jsonplaceholder.typicode.com/${queryKey[0]}?_page=${queryKey[1]}&_limit=7`);
    if(!response.ok){
        throw new Error('Something went wrong');
    }
    return response.json();
}

const Paginated = () => {
    const [page,setPage] = useState(1)

    const {data:posts,isError,error,isFetching,isPending} = useQuery({
    queryKey: ['posts',page],
    queryFn: getPosts,
    })

    if(isPending){
        return <h1>Loading...🐱‍🚀💫</h1>
    }

    if(isFetching){
        return <h1>Fetching...🐱‍🚀💫</h1>
    }

    if(isError){
        return <h1>{error.message}❌</h1>
    }

  return (
    <div>
        <button
         onClick={()=>setPage(prev=>prev-1)}
         disabled={page===1}
        >
            Previous
        </button>

        <button
            onClick={()=>setPage(prev=>prev+1)}
            disabled={posts?.length<7}
        
        >
            Next

        </button>

        {
            posts?.map(post=>(
                <div key={post.id}>
                    <h1>{post.title}</h1>
                    <p>{post.body}</p>
                </div>
            ))

        }
      
    </div>
  )
}

export default Paginated
