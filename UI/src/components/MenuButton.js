import { Button, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import { map } from 'lodash';
import { useRef } from 'react';

export default function MenuButton({
  isMenuOpen,
  label = null,
  onMenuItemClick,
  options,
  handleToggle,
  handleClose,
  startIcon,
  variant = 'contained'
}) {
  const anchorRef = useRef(null);

  return (
    <>
      {label ? (
        <Button
          ref={anchorRef}
          id='composition-button'
          aria-controls={isMenuOpen ? 'composition-menu' : undefined}
          aria-expanded={isMenuOpen ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
          variant={variant}
          startIcon={startIcon}
        >
          {label}
        </Button>
      ) : (
        <IconButton
          ref={anchorRef}
          id='composition-button'
          aria-controls={isMenuOpen ? 'composition-menu' : undefined}
          aria-expanded={isMenuOpen ? 'true' : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
        >
          {startIcon}
        </IconButton>
      )}
      <Popper
        sx={{ zIndex: 99 }}
        open={isMenuOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        placement='bottom-start'
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ marginTop: '10px', transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={isMenuOpen} id='composition-menu' aria-labelledby='composition-button'>
                  {map(options, (opt, pIndex) => (
                    <MenuItem key={pIndex} onClick={() => onMenuItemClick(opt)}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
