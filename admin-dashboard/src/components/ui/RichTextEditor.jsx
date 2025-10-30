import React, { useState, useRef } from 'react';
import { 
  BoldIcon, ItalicIcon, ListBulletIcon, NumberedListIcon,
  LinkIcon, PhotoIcon, ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Start writing...',
  className = ''
}) => {
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleInput = () => {
    if (onChange) {
      onChange(editorRef.current?.innerHTML || '');
    }
  };

  const toolbarButtons = [
    { icon: BoldIcon, command: 'bold', title: 'Bold' },
    { icon: ItalicIcon, command: 'italic', title: 'Italic' },
    { icon: ListBulletIcon, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: NumberedListIcon, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: ChatBubbleLeftIcon, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: LinkIcon, action: insertLink, title: 'Insert Link' },
    { icon: PhotoIcon, action: insertImage, title: 'Insert Image' }
  ];

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={() => button.action ? button.action() : execCommand(button.command, button.value)}
            title={button.title}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          >
            <button.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`p-3 min-h-[200px] focus:outline-none ${
          isFocused ? 'bg-white' : 'bg-gray-50'
        }`}
        placeholder={placeholder}
        style={{ 
          outline: 'none',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      />
    </div>
  );
};

export default RichTextEditor; 