import React from 'react'
import {useQuery} from "@tanstack/react-query"

const fetchUsers = async ({queryKey})=>{
    const response = await fetch(`https://jsonplaceholder.typicode.cm/${queryKey[0]}`);

    if(!response.ok){
        throw new Error('Something went wrong');
    }
    return response.json();
    
}

const fetchPosts = async({queryKey})=>{
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${queryKey[1]}/posts`);

    if(!response.ok){
        throw new Error('Something went wrong');
    }
    return response.json();

}

const DependentQuery = () => {
    const {data:users,isPending,isError,isFetching,error} = useQuery({
        queryKey:['users'],
        queryFn:fetchUsers
    
    });

    const firstUserId = users?.[0]?.id;


    const {data:posts} = useQuery({
        queryKey:['posts',firstUserId],
        queryFn:fetchPosts,
        enabled: !!firstUserId

    })

    if(isPending){
        return <h1>Loading...🐱‍🚀💫</h1>
    }
    if(isError){
        return <h1>{error.message}❌</h1>

    }

    // isFetching means background refetching
    if(isFetching){
        return <h1>Fetching...🐱‍🚀💫</h1>
    }



  return (
    <div>
        {
            posts?.map(post=>(
                <div key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            
            ))
        }
      
    </div>
  )
}

export default DependentQuery
