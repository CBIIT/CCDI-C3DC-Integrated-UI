import React from 'react';
import { Button, withStyles } from '@material-ui/core';
import { linkStyles } from './linkStyles';
import guideIcon from '../exportButton/assets/guide.svg';

const linkButtonView = (props) => {
    const { classes } = props;
    return (
        <Button
            component="a"
            className={`link ${classes.link} ${classes.linkBtn}`}
            href="/user-guide.pdf"
            target="_blank"
            rel="noopener noreferrer"
        >
            USER GUIDE
            <img className={classes.guideIcon} src={guideIcon} alt="" aria-hidden="true" />
        </Button>
    );

}
export default withStyles(linkStyles)(linkButtonView);