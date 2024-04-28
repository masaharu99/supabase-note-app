import { FC, useEffect, useState } from 'react'
import { Note } from '../types/types'
import useStore from '../store'
import { useMutateNote } from '../hooks/useMutateNote'
import { supabase } from '../utils/supabase'
import { Spinner } from './Spinner'
import Link from 'next/link'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'

export const NoteItem: FC<Omit<Note, 'created_at' | 'comments'>> = ({
  id,
  title,
  content,
  user_id,
}) => {
  const [userId, setUserId] = useState<string | undefined>('')
  const update = useStore((state) => state.updateEditedNote)
  const { deleteNoteMutation } = useMutateNote()

  useEffect(() => {
    const setUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id)
    }
    setUser()
  }, [])

  if (deleteNoteMutation.isLoading) {
    return <Spinner />
  }

  return (
    <li className="my-3">
      <Link
        href={`note/${id}`}
        prefetch={false}
        className="cursor-pointer hover:text-pink-600"
      >
        {title}
      </Link>
      {userId === user_id && (
        <div className="float-right ml-20 flex">
          <PencilIcon
            className="mx-1 h-5 w-5 cursor-pointer text-blue-500"
            onClick={() => {
              update({
                id,
                title,
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
