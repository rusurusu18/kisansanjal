import React, { useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { Card, CardHeader, CardBody, Input, Button, Select, Badge } from '../../components/ui.jsx'

function threadKey(a, b) {
  return [a, b].sort().join('__')
}

export default function Chat() {
  const { user } = useAuth()
  const { db, sendMessage } = useStore()

  const possibleUsers = useMemo(() => {
    if (user.role === 'buyer') return db.users.filter(u => u.role === 'farmer')
    if (user.role === 'farmer') return db.users.filter(u => u.role === 'buyer')
    return db.users.filter(u => u.role !== 'admin')
  }, [db.users, user.role])

  const [toId, setToId] = useState(possibleUsers[0]?.id || '')
  const [text, setText] = useState('')

  const threadId = useMemo(() => (toId ? threadKey(user.id, toId) : ''), [user.id, toId])

  const msgs = useMemo(() => {
    if (!threadId) return []
    return db.messages
      .filter(m => m.threadId === threadId)
      .sort((a,b) => a.createdAt - b.createdAt)
  }, [db.messages, threadId])

  const onSend = (e) => {
    e.preventDefault()
    if (!text.trim() || !toId) return
    sendMessage({ threadId, fromId: user.id, toId, text: text.trim() })
    setText('')
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader
          title="Communication Portal"
          subtitle="In-app chat between farmers and buyers for negotiation and logistics."
          right={<Badge>Secure chat</Badge>}
        />
        <CardBody className="space-y-4">
          <Select label="Chat with" value={toId} onChange={(e)=>setToId(e.target.value)}>
            {possibleUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
          </Select>

          <div className="border border-brand-100 rounded-2xl p-4 h-[320px] overflow-auto bg-brand-50">
            {msgs.map(m => {
              const mine = m.fromId === user.id
              return (
                <div key={m.id} className={`mb-2 flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-brand-700 text-white' : 'bg-white border border-brand-100 text-brand-900'}`}>
                    {m.text}
                  </div>
                </div>
              )
            })}
            {!msgs.length ? <div className="text-sm text-brand-700">No messages yet. Start the conversation.</div> : null}
          </div>

          <form onSubmit={onSend} className="flex gap-2">
            <Input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Type message..." />
            <Button type="submit">Send</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
