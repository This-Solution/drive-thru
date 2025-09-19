import { useTheme } from '@emotion/react';
import { CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography, useMediaQuery } from '@mui/material';
import CjReactTable from 'components/@extended/Table/ReactTable';
import enums from 'utils/enums';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import { GlobalFilter } from 'components/@extended/Table/ReactTableFilter';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiService from 'service/ApiService';

const MenuPricing = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const { siteId } = useParams();
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [orderModeList, setOrderModeList] = useState([]);
    const [selectedMenuId, setSelectedMenuId] = useState(0);
    const [selectedType, setSelectedType] = useState(enums.MenuPricingType.MenuItem);
    const [selectedSize, setSelectedSize] = useState(0);
    const [pricingData, setPricingData] = useState([]);
    const [subMenuItems, setSubMenuItems] = useState([]);

    useEffect(() => {
        getItemPriceBySiteId();
    }, [siteId]);

    const getItemPriceBySiteId = async () => {
        setLoading(true);
        const [orderModeList, subMenuList, itemsPricing] = await Promise.all([
            await apiService.getOrderModeListBySiteIdAsync(siteId),
            await apiService.getLookupSubMenuItemsAsync(),
            await apiService.getOrderkeyItemsBySiteIdAsync({ siteId: siteId })
        ])

        if (orderModeList && orderModeList.data.length > 0) {
            setOrderModeList([{ menuId: 0, orderMode: 'All' }, ...orderModeList.data]);
        }
        if (subMenuList && subMenuList.data.length > 0) {
            setSubMenuItems(subMenuList.data)
        }
        if (itemsPricing && itemsPricing.data.length > 0) {
            const items = itemsPricing.data.map((item) => {
                const subMenu = subMenuList.data && subMenuList.data.find((category) => category.subMenuId === item.subMenuId);
                if (subMenu) {
                    return { ...item, subMenuName: subMenu.name };
                }
                return item;
            });
            setPricingData(items);
        }
        setLoading(false);
    }

    const changeComboSize = async (size) => {
        setSelectedSize(Number(size));
        const { data } = await apiService.getOrderkeyItemsBySiteIdAsync({ siteId: siteId, levelId: size });
        if (data) {
            const items = data.map((item) => {
                const subMenu = subMenuItems.find((category) => category.subMenuId === item.subMenuId);
                return subMenu ? { ...item, subMenuName: subMenu.name } : item;
            });
            setPricingData(items);
        }
    };

    const columnsMap = {
        [enums.MenuPricingType.MenuItem]: [
            { Header: 'Category', accessor: 'subMenuName' },
            { Header: 'Item Name', accessor: 'name' },
            { Header: 'Price', accessor: 'price' },
        ],
        [enums.MenuPricingType.Combo]: [
            { Header: 'Category', accessor: 'subMenuName' },
            { Header: 'Combo Name', accessor: 'name' },
            { Header: 'Price', accessor: 'price' },
            {
                Header: 'Size', accessor: 'combolevelId',
                Cell: ({ value }) => enums.ComboSize[value],
            },
        ]
    };

    const columns = useMemo(() => columnsMap[selectedType], [selectedType]);

    const rowData = useMemo(() => {
        let filtered = pricingData.filter((item) => item.type === selectedType);
        if (selectedMenuId) {
            filtered = filtered.filter(item => item.menuId === selectedMenuId);
        }
        if (selectedType === enums.MenuPricingType.Combo && selectedSize) {
            filtered = filtered.filter((item) => item.combolevelId === selectedSize);
        }
        filtered = filtered.filter((item) => subMenuItems.some((subMenu) => subMenu.subMenuId === item.subMenuId));
        return filtered;
    }, [pricingData, selectedType, selectedMenuId]);

    return (
        <Grid rowSpacing={3} columnSpacing={3}>
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2, mt: 2 }}>
                    <Typography variant="h4" sx={{ pl: 2 }}>
                        Menu Pricing
                    </Typography>
                </Stack>
                <MainCard content={false}>
                    <ScrollX>
                            <>
                                <Grid
                                    container
                                    spacing={2}
                                    p={2}
                                    direction={matchDownSM ? 'column' : 'row'}
                                    alignItems="center"
                                >
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <GlobalFilter
                                                preGlobalFilteredRows={rowData}
                                                globalFilter={globalFilter}
                                                setGlobalFilter={setGlobalFilter}
                                                size="large"
                                                sx={{ width: '100%' }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3}>
                                        <FormControl fullWidth size="medium">
                                            <InputLabel>Order Mode</InputLabel>
                                            <Select
                                                value={selectedMenuId}
                                                onChange={(e) => setSelectedMenuId(e.target.value)}
                                                label="Order Mode"
                                            >
                                                {orderModeList.map((menu) => (
                                                    <MenuItem key={menu.menuId} value={menu.menuId}>
                                                        {menu.orderMode}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={3} md={3}>
                                        <FormControl fullWidth size="medium">
                                            <InputLabel>Type</InputLabel>
                                            <Select
                                                value={selectedType}
                                                onChange={(e) => setSelectedType(e.target.value)}
                                                label="Type"
                                            >
                                                {Object.entries(enums.MenuPricingType).map(([key, value]) => (
                                                    <MenuItem key={key} value={value}>
                                                        {value}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    {selectedType === enums.MenuPricingType.Combo && (
                                        <Grid item xs={12} sm={3} md={2}>
                                            <FormControl fullWidth size="medium">
                                                <InputLabel>Size</InputLabel>
                                                <Select
                                                    value={selectedSize}
                                                    onChange={(e) => changeComboSize(e.target.value)}
                                                    label="Size"
                                                >
                                                    {Object.entries(enums.ComboSize).map(([key, value]) => (
                                                        <MenuItem key={key} value={key}>
                                                            {value}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    )}
                                </Grid>
                                <CjReactTable
                                    isLoading={isLoading}
                                    columns={columns}
                                    globalFilter={globalFilter}
                                    data={rowData}
                                />
                            </>
                    </ScrollX>
                </MainCard>
            </Grid>
        </Grid>
    );
}

export default MenuPricing;
