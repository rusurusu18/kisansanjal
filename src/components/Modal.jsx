import React from 'react'
import { Button } from './ui.jsx'

export default function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="p-5 border-b border-brand-100">
          <div className="flex items-center justify-between">
            <div className="text-lg font-extrabold text-brand-900">{title}</div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-brand-50 hover:bg-brand-100 flex items-center justify-center text-brand-700"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-5">
          {children}
        </div>
        
        {actions && (
          <div className="p-5 border-t border-brand-100 flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmText}</Button>
        </>
      }
    >
      <p className="text-sm text-brand-700">{message}</p>
    </Modal>
  )
}
