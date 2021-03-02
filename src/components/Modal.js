import "../styles/modal.scss";

export const Modal = ({ title, children, actions }) => {
  return (
    <div className="modal">
      <div className="modal-title">{title}</div>
      <div className="modal-body">{children}</div>
      {actions && (
        <div className="modal-actions">
          {actions.map((action, index) => (
            <button
              className={`${action.positive && "confirm-btn"} ${
                action.negative && "cancel-btn"
              }`}
              key={index}
              onClick={action.onClick}
            >
              {action.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
