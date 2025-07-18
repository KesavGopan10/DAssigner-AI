import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

const defaultSize = 'md';
const sizeMap = {
  sm: '1rem',
  md: '1.25rem',
  lg: '1.5rem',
  xl: '2rem'
};

const IconWrapper: React.FC<IconProps> = ({ size = defaultSize, ...props }) => (
  <svg 
    width={sizeMap[size]} 
    height={sizeMap[size]}
    strokeWidth={2}
    fill="none" 
    {...props}
  />
);

export const DAssignerLogoIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25L3 7.875v8.25L12 21.75l9-5.625V7.875L12 2.25zM12 4.5l6.875 4.313L12 13.125l-6.875-4.313L12 4.5zM4.5 9.177l6.875 4.313V19.5L4.5 14.823V9.177zm15 0v5.646L12.625 19.5V13.49l6.875-4.313z" clipRule="evenodd" />
  </IconWrapper>
);

export const BoltIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </IconWrapper>
);

export const SendIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
  </IconWrapper>
);

export const MicrophoneIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5a6 6 0 0 0-12 0v1.5a6 6 0 0 0 6 6Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v.75a7.5 7.5 0 0 1-7.5 7.5s-7.5-3.358-7.5-7.5v-.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11.25v-1.5a3 3 0 0 1 6 0v1.5" />
  </IconWrapper>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </IconWrapper>
);

export const CopyIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
  </IconWrapper>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </IconWrapper>
);

export const EyeIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </IconWrapper>
);

export const CodeBracketIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </IconWrapper>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </IconWrapper>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </IconWrapper>
);

export const MagicWandIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-3.483 0l-1.263 1.263a3 3 0 0 0 0 4.242a3 3 0 0 0 4.242 0l1.263-1.263a3 3 0 0 0 0-4.242Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.53 8.122a3 3 0 0 0-3.483 0l-1.263 1.263a3 3 0 0 0 0 4.242a3 3 0 0 0 4.242 0l1.263-1.263a3 3 0 0 0 0-4.242Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0 3.483 0l1.263-1.263a3 3 0 0 0 0-4.242a3 3 0 0 0-4.242 0L9.53 16.122Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m11 2.25-1.75 3.5-3.5 1.75 3.5 1.75L11 13.5l1.75-3.5 3.5-1.75-3.5-1.75L11 2.25Z" />
  </IconWrapper>
);

export const HistoryIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </IconWrapper>
);

export const NewChatIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </IconWrapper>
);

export const XMarkIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </IconWrapper>
);

export const Bars3Icon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </IconWrapper>
);

export const UserIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </IconWrapper>
);

export const Cog6ToothIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.985c-.008.379.137.752.43.992l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.985c.008-.379-.137-.752-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.298-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </IconWrapper>
);

export const PencilIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </IconWrapper>
);

export const PuzzlePieceIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.595.484-1.08 1.08-1.08h.36c.62 0 1.125.504 1.125 1.125v.375c0 .621-.504 1.125-1.125 1.125h-.375a1.08 1.08 0 0 1-1.08-1.08V6.087Zm-3.375 0c0-.595.484-1.08 1.08-1.08h.36c.62 0 1.125.504 1.125 1.125v.375c0 .621-.504 1.125-1.125 1.125h-.375a1.08 1.08 0 0 1-1.08-1.08V6.087Zm-3.375 0c0-.595.484-1.08 1.08-1.08h.36c.62 0 1.125.504 1.125 1.125v.375c0 .621-.504 1.125-1.125 1.125h-.375a1.08 1.08 0 0 1-1.08-1.08V6.087Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.523c0-1.23.636-2.345 1.623-2.933.987-.588 2.232-.933 3.527-.933h.18c1.295 0 2.54.345 3.527.933.987.588 1.623 1.703 1.623 2.933s-.636 2.345-1.623 2.933c-.987.588-2.232.933-3.527.933h-.18c-1.295 0-2.54-.345-3.527-.933C5.136 21.868 4.5 20.753 4.5 19.523Z" />
  </IconWrapper>
);

export const DevicePhoneMobileIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75A2.25 2.25 0 0 0 15.75 1.5h-2.25m-3.75 0h3.75M12 18.75h.008v.008H12v-.008Z" />
  </IconWrapper>
);

export const DeviceTabletIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-15a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25Z" />
  </IconWrapper>
);

export const ComputerDesktopIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
  </IconWrapper>
);

export const InformationCircleIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </IconWrapper>
);

export const ArrowTopRightOnSquareIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </IconWrapper>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09c-1.18 0-2.09.954-2.09 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </IconWrapper>
);

export const FolderOpenIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
  </IconWrapper>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <IconWrapper viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </IconWrapper>
);