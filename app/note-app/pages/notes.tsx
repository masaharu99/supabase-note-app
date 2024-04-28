import { GetStaticProps, NextPage } from 'next'
import React from 'react'

import { supabase } from '../utils/supabase'
import { Layout } from '../components/Layout'
import {
  ArrowLeftStartOnRectangleIcon,
  DocumentIcon,
} from '@heroicons/react/24/solid'
import { Note } from '../types/types'
import { NoteItem } from '../components/NoteItem'
import { NoteForm } from '../components/NoteForm'

export const getStaticProps: GetStaticProps = async () => {
  console.log('ISR invoked - notes page')
  const { data: notes, error } = await supabase
    .from('notes')
    .select()
    .order('created_at', { ascending: true })
  if (error) {
    throw new Error(`${error.message}: ${error.details}`)
  }
  return {
    props: { notes },
    revalidate: false,
  }
}

type StaticProps = {
  notes: Note[]
}

const Notes: NextPage<StaticProps> = ({ notes }) => {
  const signOut = () => {
    supabase.auth.signOut()
  }

  return (
    <Layout title="Notes">
      <ArrowLeftStartOnRectangleIcon
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
      <DocumentIcon className="h-8 w-8 text-blue-500" />
      <ul className="my-2">
        {notes.map((note) => (
          <NoteItem
            id={note.id}
            title={note.title}
            content={note.content}
            user_id={note.user_id}
          />
        ))}
      </ul>
      <NoteForm />
    </Layout>
  )
}

export default Notes
