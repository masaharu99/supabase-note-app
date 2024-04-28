import { useMutation } from 'react-query'
import useStore from '../store'

import { EditedNote, Note } from '../types/types'
import { supabase } from '../utils/supabase'
import { revalidateList, revalidateSingle } from '../utils/revalidation'

export const useMutateNote = () => {
  const reset = useStore((state) => state.resetEditedNote)

  const createNoteMutate = useMutation(
    async (note: Omit<Note, 'created_at' | 'id' | 'comments'>) => {
      const { data, error } = await supabase.from('notes').insert(note).select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        // revalidateList()
        reset()
        alert('Successfully completed')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    },
  )

  const updateNoteMutation = useMutation(
    async (note: EditedNote) => {
      const { data, error } = await supabase
        .from('notes')
        .update({ title: note.title, content: note.content })
        .eq('id', note.id)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        // revalidateList()
        // revalidateSingle(res[0].id)
        reset()
        alert('Successfully completed')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    },
  )

  const deleteNoteMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .select()
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        // revalidateList()
        reset()
        alert('Sucessfully completed')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    },
  )

  return { createNoteMutate, updateNoteMutation, deleteNoteMutation }
}
