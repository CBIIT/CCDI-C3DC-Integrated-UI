import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { syncInventoryExploreModeFromPathname } from '../../components/Inventory/InventoryState';

/**
 * Keeps inventoryReducer.exploreMode aligned with the current route.
 */
export default function InventoryRouteSync() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    dispatch(syncInventoryExploreModeFromPathname(pathname));
  }, [dispatch, pathname]);

  return null;
}
