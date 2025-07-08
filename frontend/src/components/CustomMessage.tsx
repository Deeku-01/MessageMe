
import { MessageSimple } from 'stream-chat-react';

const CustomMessage = (props:any) => {
  // Add safety checks for props and message
  if (!props || !props.message) {
    console.warn('CustomMessage: Missing props or message');
    return <MessageSimple {...props} />;
  }

  const { message } = props;
  
  // Safety check for attachments
  const attachments = message.attachments || [];
  
  console.log('CustomMessage - message:', message);
  console.log('CustomMessage - attachments:', attachments);

  // Check if this message has a video call attachment
  const hasVideoCall = attachments.some((attachment:any) => 
    attachment && attachment.type === 'video-call'
  );

  if (hasVideoCall) {
    const videoCallAttachment = attachments.find((attachment:any) => 
      attachment && attachment.type === 'video-call'
    );

    return (
      <div className="str-chat__message str-chat__message--me">
        <div className="str-chat__message-inner">
          <div className="str-chat__message-bubble">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🎥</span>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                  {videoCallAttachment?.title || 'Video Call Invitation'}
                </h3>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {videoCallAttachment?.text || 'Join the video call to connect face-to-face!'}
              </p>

              {videoCallAttachment?.fields && (
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  {videoCallAttachment.fields.map((field:any, index:any) => (
                    <div key={index}>
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        {field.title}:
                      </span>
                      <span className="ml-1 text-gray-800 dark:text-gray-200">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {videoCallAttachment?.call_url && (
                <a
                  href={videoCallAttachment.call_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <span>🎥</span>
                  Join Video Call
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For regular messages, use the default MessageSimple component
  return <MessageSimple {...props} />;
};

export default CustomMessage;