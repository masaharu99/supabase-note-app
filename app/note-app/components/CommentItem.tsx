import { FC, useEffect, useState } from 'react'
import { Comment } from '../types/types'
import useStore from '../store'
import { useMutateComment } from '../hooks/useMutateComment'
import { supabase } from '../utils/supabase'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

export const CommentItem: FC<Omit<Comment, 'created_at' | 'note_id'>> = ({
  id,
  content,
  user_id,
}) => {
  const [userId, setUserId] = useState<string | undefined>('')
  const update = useStore((state) => state.updateEditedComment)
  const { deleteNoteMutation } = useMutateComment()

  useEffect(() => {
    const setUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id)
    }
    setUser()
  }, [])

  return (
    <li className="my-3">
      <span>{content}</span>
      {userId === user_id && (
        <div className="float-right ml-20 flex">
          <PencilIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              update({
                id,
                content,
              })
            }}
          />
          <TrashIcon
            className="h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              deleteNoteMutation.mutate(id)
            }}
          />
        </div>
      )}
    </li>
  )
}
