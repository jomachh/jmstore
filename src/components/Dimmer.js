import "../styles/dimmer.scss";

export const Dimmer = ({ children, onDismiss, show }) => {
  return (
    <div className="dimmer" style={{ display: show ? "flex" : "none" }}>
      {children}
    </div>
  );
};
