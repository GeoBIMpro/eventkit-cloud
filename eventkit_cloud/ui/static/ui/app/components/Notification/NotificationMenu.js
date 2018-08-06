import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { IconButton, IconMenu, MenuItem } from 'material-ui';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import FlagIcon from '@material-ui/icons/Flag';
import CloseIcon from '@material-ui/icons/Close';
import { getNotificationViewPath } from '../../utils/notificationUtils';
import {
    markNotificationsAsRead,
    markNotificationsAsUnread,
    removeNotifications,
} from '../../actions/notificationsActions';

export class NotificationMenu extends React.Component {
    constructor(props) {
        super(props);
        this.onMount = this.onMount.bind(this);
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleMarkAsRead = this.handleMarkAsRead.bind(this);
        this.handleMarkAsUnread = this.handleMarkAsUnread.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleView = this.handleView.bind(this);
        this.state = {
            // This is a slight hack to prevent some glitchy behavior in the notifications dropdown. Without it, clicking
            // the "View" menu item will cause the dropdown to immediately close as the menu item stays for a moment to
            // show its ripple effect. This trick also just makes the menu feel a little more responsive.
            forceClose: false,
        };
    }

    componentDidUpdate() {
        this.onMount();
    }

    onMount() {
        if (this.state.forceClose) {
            this.setState({ forceClose: false });
        }
    }

    handleMenuItemClick(e) {
        e.stopPropagation();
        this.setState({ forceClose: true });
    }

    handleMarkAsRead(e) {
        this.handleMenuItemClick(e);
        if (this.props.onMarkAsRead(this.props.notification)) {
            this.props.markNotificationsAsRead([this.props.notification]);
        }
    }

    handleMarkAsUnread(e) {
        this.handleMenuItemClick(e);
        if (this.props.onMarkAsUnread(this.props.notification)) {
            this.props.markNotificationsAsUnread([this.props.notification]);
        }
    }

    handleRemove(e) {
        this.handleMenuItemClick(e);
        if (this.props.onRemove(this.props.notification)) {
            this.props.removeNotifications([this.props.notification]);
        }
    }

    handleView(e) {
        this.handleMenuItemClick(e);
        const path = getNotificationViewPath(this.props.notification);
        if (this.props.onView(this.props.notification, path)) {
            this.props.router.push(path);
            this.props.markNotificationsAsRead([this.props.notification]);
        }
    }

    render() {
        const styles = {
            menuButton: {
                padding: '0',
                width: '20px',
                height: 'auto',
                verticalAlign: 'middle',
            },
            menuButtonIcon: {
                color: '#4598bf',
            },
        };

        const viewPath = getNotificationViewPath(this.props.notification);

        return (
            <IconMenu
                style={this.props.style}
                iconButtonElement={
                    <IconButton
                        style={styles.menuButton}
                        iconStyle={styles.menuButtonIcon}
                    >
                        <MoreVertIcon />
                    </IconButton>
                }
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                open={this.state.forceClose ? false : undefined}
            >
                {viewPath ?
                    <MenuItem
                        className="qa-NotificationMenu-MenuItem-View"
                        style={styles.menuItem}
                        primaryText="View"
                        leftIcon={<OpenInNewIcon />}
                        onClick={this.handleView}
                    />
                    :
                    null
                }
                {this.props.notification.unread ?
                    <MenuItem
                        className="qa-NotificationMenu-MenuItem-MarkAsRead"
                        style={styles.menuItem}
                        primaryText="Mark As Read"
                        leftIcon={<FlagIcon />}
                        onClick={this.handleMarkAsRead}
                    />
                    :
                    <MenuItem
                        className="qa-NotificationMenu-MenuItem-MarkAsUnread"
                        style={styles.menuItem}
                        primaryText="Mark As Unread"
                        leftIcon={<FlagIcon />}
                        onClick={this.handleMarkAsUnread}
                    />
                }
                <MenuItem
                    className="qa-NotificationMenu-MenuItem-Remove"
                    style={styles.menuItem}
                    primaryText="Remove"
                    leftIcon={<CloseIcon />}
                    onClick={this.handleRemove}
                />
            </IconMenu>
        );
    }
}

NotificationMenu.propTypes = {
    style: PropTypes.object,
    notification: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    onMarkAsRead: PropTypes.func,
    onMarkAsUnread: PropTypes.func,
    onRemove: PropTypes.func,
    onView: PropTypes.func,
    markNotificationsAsRead: PropTypes.func.isRequired,
    markNotificationsAsUnread: PropTypes.func.isRequired,
    removeNotifications: PropTypes.func.isRequired,
};

NotificationMenu.defaultProps = {
    style: {},
    onMarkAsRead: () => true,
    onMarkAsUnread: () => true,
    onRemove: () => true,
    onView: () => true,
};

function mapDispatchToProps(dispatch) {
    return {
        markNotificationsAsRead: notifications => dispatch(markNotificationsAsRead(notifications)),
        markNotificationsAsUnread: notifications => dispatch(markNotificationsAsUnread(notifications)),
        removeNotifications: notifications => dispatch(removeNotifications(notifications)),
    };
}

export default connect(
    null,
    mapDispatchToProps,
)(NotificationMenu);
