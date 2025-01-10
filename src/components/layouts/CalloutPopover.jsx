import Popover from '@mui/material/Popover';

export default function CalloutPopover({ children, horizontal, right, left, ...props }) {
  return (
      <Popover
        onClose={() => { }} // "escapeKeyDown" や "backdropClick" で発火する onClose は無効化
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: horizontal,
        }}
        transformOrigin={{
          vertical: -20,
          horizontal: 0
        }}
        disableScrollLock={true} // Popover の表示中もスクロール可能にする
        hideBackdrop={true} // backdrop は描画しない
        disablePortal={true} // children を親コンポーネントの下に描画
        slotProps={{
          root: {
            sx: {
              pointerEvents: "none" // root スロットはクリック判定を透過する
            }
          },
          paper: {
            sx: {
              pointerEvents: "auto", // paper スロットへのクリック判定は残す
              color: "white",
              bgcolor: "rgb(6, 95, 212)",
              overflow: "visible",
              "&::before": {
                content: '""',
                border: "16px solid transparent",
                borderBottom: "16px solid rgb(6, 95, 212)",
                position: "absolute",
                top: -30,
                right: right,
                left: left
              }
            },
          }
        }}
        {...props}
      >
       {children}
      </Popover>
  );
}
