import { find, last, split } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import { Divider, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';

// project imports
import MainCard from '../MainCard';

// assets

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = ({
  card,
  divider = true,

  maxItems,
  navigation,
  rightAlign,
  separator,
  title,
  sx,
  ...others
}) => {
  const location = useLocation();
  const [items, setItems] = useState([]);
  const currentPath = location.pathname;

  const makeOriginalUrl = (foundPath, originalUrl) => {
    const foundPaths = foundPath.split('/');
    const originalUrls = originalUrl.split('/');

    if (foundPaths && originalUrls && foundPaths.length !== originalUrls.length) {
      return foundPath;
    }

    const original = [];
    foundPaths.map((u, i) => {
      if (originalUrls[i].includes(':')) {
        original.push(originalUrls[i]);
      } else {
        original.push(foundPaths[i]);
      }
    });

    return original.join('/');
  };

  // set active item state
  const getCollapse = (menu, menuItems) => {
    menu.children.filter((collapse) => {
      if (currentPath.includes(split(collapse.url, ':')[0])) {
        if (collapse?.children && collapse?.children?.length > 0 && currentPath !== collapse.url) {
          let breadCrumbs = items;
          collapse?.children.map((subMenu) => {
            const originalUrl = subMenu.url.includes(':') ? makeOriginalUrl(currentPath, subMenu.url) : subMenu.url;
            const itemIndex = breadCrumbs.findIndex((b) => b.url === `${currentPath}${location.search}`);
            if (subMenu.url === originalUrl) {
              if (itemIndex < 0) {
                // Item not exist in bread crumb
                const breadCrumb = { ...subMenu };
                breadCrumb.url = `${currentPath}${location.search}`;
                // If not found parent then add
                if (breadCrumbs.length === 0) {
                  const isExistParent = find(breadCrumbs, (col) => col.id === collapse.id);
                  if (!isExistParent) {
                    breadCrumbs.push(collapse);
                  }
                }
                breadCrumbs.push(breadCrumb);
              } else {
                breadCrumbs = breadCrumbs.slice(0, itemIndex + 1);
              }
            }
          });
          menuItems.push(...breadCrumbs);
        } else {
          const cloneCollapse = { ...collapse };
          cloneCollapse.url = `${currentPath}${location.search}`;
          menuItems.push(cloneCollapse);
        }
      }
      return false;
    });
  };

  useEffect(() => {
    const menuItems = [];
    navigation?.items?.map((menu) => {
      if (menu.type && menu.type === 'group') {
        getCollapse(menu, menuItems);
      }
      return false;
    });
    setItems(menuItems);
  }, [location]);

  let itemContent;
  let breadcrumbContent = <Typography />;
  let itemTitle = '';

  // items
  if (items.length > 0 && last(items).type === 'item') {
    const item = last(items);
    itemTitle = item.title;

    itemContent = (
      <Typography variant='subtitle1' color='textPrimary'>
        {itemTitle}
      </Typography>
    );

    // main
    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <MainCard
          border={card}
          sx={card === false ? { mb: 1, bgcolor: 'transparent', ...sx } : { mb: 1, ...sx }}
          {...others}
          content={card}
          shadow='none'
        >
          <Stack direction='row' justifyContent='space-between' alignItems='center'>
            <Grid
              container
              direction={rightAlign ? 'row' : 'column'}
              justifyContent={rightAlign ? 'space-between' : 'flex-start'}
              alignItems={rightAlign ? 'center' : 'flex-start'}
              spacing={1}
            >
              {title && item.showTitle && (
                <Grid item sx={{ mt: card === false ? 0.25 : 1 }}>
                  <Typography variant='h2'>{item.subTitle}</Typography>
                </Grid>
              )}
            </Grid>
          </Stack>
          {card === false && divider !== false && <Divider sx={{ mt: 2 }} />}
        </MainCard>
      );
    }
  }
  return breadcrumbContent;
};

Breadcrumbs.propTypes = {
  card: PropTypes.bool,
  divider: PropTypes.bool,
  icon: PropTypes.bool,
  icons: PropTypes.bool,
  maxItems: PropTypes.number,
  navigation: PropTypes.object,
  rightAlign: PropTypes.bool,
  separator: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  title: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export default Breadcrumbs;
