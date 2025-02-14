import { useContext, useState, useEffect, useCallback } from 'react'

import AuthContext from '../../store/AuthContext'
import Errors from '../Errors/Errors'
import PostForm from './PostForm'
import PostsList from './PostsLists'

const Posts = () => {
  const authContext = useContext(AuthContext)
  const [posts, setPosts] = useState<any>([])
  // ToDo: post Type define
  const [errors, setErrors] = useState({})

  const fetchPostsHandler = useCallback(async () => {
    setErrors({})

    try {
      const response = await fetch('/api/posts', {
        headers: {
          Authorization: `Bearer ${authContext.token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        const errorText = 'Fetching posts failed.'
        if (!Object.prototype.hasOwnProperty.call(data, 'error')) {
          throw new Error(errorText)
        }
        if (typeof data.error === 'string') {
          setErrors({ unknown: data.error })
        } else {
          setErrors(data.error)
        }
      } else {
        setPosts(data.data)
      }
    } catch (error: any) {
      setErrors({ error: error.message })
    }
  }, [authContext.token])

  useEffect(() => {
    fetchPostsHandler()
  }, [fetchPostsHandler])

  const addPostHandler = (postData: any) => {
    setPosts((prevState: any) => [...prevState, postData])
  }

  const deletePostHandler = (postID: any) => {
    // ToDo: post Type define
    setPosts((prevState: any) => prevState.filter((post: any) => post.ID !== postID))
  }

  const editPostHandler = () => {
    fetchPostsHandler()
  }

  const postsContent =
    posts.length === 0 ? (
      <p>No posts yet</p>
    ) : (
      <PostsList posts={posts} onEditPost={editPostHandler} onDeletePost={deletePostHandler} />
    )

  const errorContent = Object.keys(errors).length === 0 ? null : Errors(errors)

  return (
    <section>
      <h1 className='pb-4'>My posts</h1>
      <PostForm onAddPost={addPostHandler} />
      {errorContent}
      {postsContent}
    </section>
  )
}

export default Posts
