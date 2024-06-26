import { FC, FormEvent } from 'react'
import useStore from '../store'
import { useMutateComment } from '../hooks/useMutateComment'
import { supabase } from '../utils/supabase'
import { Spinner } from './Spinner'

export const CommentForm: FC<{ noteId: string }> = ({ noteId }) => {
  const { editedComment } = useStore()
  const update = useStore((state) => state.updateEditedComment)
  const { createCommentMutation, updateCommentMutation } = useMutateComment()

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedComment.id === '') {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      createCommentMutation.mutate({
        content: editedComment.content,
        user_id: user?.id,
        note_id: noteId,
      })
    } else {
      updateCommentMutation.mutate({
        id: editedComment.id,
        content: editedComment.content,
      })
    }
  }

  if (updateCommentMutation.isLoading || createCommentMutation.isLoading) {
    ;<Spinner />
  }

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        className="my-2 rounded border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
        placeholder="new comment"
        value={editedComment.content}
        onChange={(e) => update({ ...editedComment, content: e.target.value })}
      />
      <button
        type="submit"
        className="ml-2 rounded bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        {editedComment.id ? 'Update' : 'Send'}
      </button>
    </form>
  )
}
