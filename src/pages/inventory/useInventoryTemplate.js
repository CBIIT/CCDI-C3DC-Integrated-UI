import { useSelector } from 'react-redux';
import { selectInventoryExploreTemplate } from '../../components/Inventory/InventoryState';

export function useInventoryTemplate() {
  return useSelector(selectInventoryExploreTemplate);
}
