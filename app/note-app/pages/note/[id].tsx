import React from 'react'
import { supabase } from '../../utils/supabase'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Note } from '../../types/types'
import { Layout } from '../../components/Layout'
import { CommentItem } from '../../components/CommentItem'
import { CommentForm } from '../../components/CommentForm'
import Link from 'next/link'
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/solid'

const getAllNoteIds = async () => {
  const { data: notes } = await supabase.from('notes').select('id')
  return notes!.map((note) => {
    return {
      params: {
        id: note.id,
      },
    }
  })
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllNoteIds()
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log('ISR invoked - detail page')
  const { data: note } = await supabase
    .from('notes')
    .select('*, comments(*)')
    .eq('id', ctx.params?.id)
    .single()
  return {
    props: {
      note,
    },
  }
}

type StaticProps = {
  note: Note
}

const NotePage: NextPage<StaticProps> = ({ note }) => {
  return (
    <Layout title="NoteDetail">
      <p className="text-3xl font-semibold text-blue-500">{note.title}</p>
      <div className="m-8 rounded-lg p-4 shadow-lg">
        <p>{note.content}</p>
      </div>
      <ul className="my-2">
        {note.comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            user_id={comment.user_id}
          />
        ))}
      </ul>
      <CommentForm noteId={note.id} />
      <Link href="/notes" passHref prefetch={false}>
        <ChevronDoubleLeftIcon className="my-6 h-6 w-6 cursor-pointer text-blue-500" />
      </Link>
    </Layout>
  )
}

export default NotePage
