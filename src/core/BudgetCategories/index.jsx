/* eslint-disable react/no-multi-comp */
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import InputBase from '@material-ui/core/InputBase'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Select from 'react-select'
import { fade } from '@material-ui/core/styles/colorManipulator'
import Tooltip from '@material-ui/core/Tooltip'
import CategoryForm from './form'
import { currencyFormatter } from '../../util/stringFormatter'
import { deleteCategory } from '../../store/budget/actions'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2)
  },
  categoryGroup: {
    marginTop: theme.spacing(2)
  },
  groupName: {
    display: 'inline-block',
    marginRight: theme.spacing(1)
  },
  circle: {
    borderRadius: 20,
    content: '" "',
    display: 'block',
    marginRight: 10,
    marginLeft: 10,
    height: 30,
    width: 30
  },
  newCategoryButton: {
    marginTop: theme.spacing(2),
    textAlign: 'center'
  },
  inputRoot: {
    width: 230,
    verticalAlign: 'bottom',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1) * 0.5,
    paddingBottom: theme.spacing(1) * 0.5,
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: fade(theme.palette.grey[400], 0.15),
    marginRight: theme.spacing(2),
    marginLeft: 0,
    '&:hover': {
      backgroundColor: fade(theme.palette.grey[400], 0.25)
    }
  },
  inputInput: {
    color: 'inherit',
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      minWidth: 230
    }
  },
  filterParentCategory: {
    width: 230,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    display: 'inline-block'
  }
}))


const BudgetCategories = () => {
  const classes = useStyles()
  const { budget, formatCurrency } = useSelector(state => ({
    budget: state.budget,
    formatCurrency: currencyFormatter(state.settings.locale, state.settings.currency)
  }))
  const dispatch = useDispatch()

  const [filter, setfilter] = React.useState({
    category: '',
    parentCategoryId: ''
  })
  const [popupCategoryId, setPopupCategoryId] = React.useState(null)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [editCategory, setEditCategory] = React.useState(null)
  const popupIsOpen = Boolean(anchorEl)

  function handleFilterChange(event) {
    if ('persist' in event) event.persist()
    setfilter(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value
    }))
  }

  const filteredCategories = () => {
    const filteredTree = budget.categoryTree.reduce((res, cat) => {
      if (filter.parentCategoryId === '' || cat.id === filter.parentCategoryId) {
        return [...res, { ...cat, options: cat.options }]
      }
      return res
    }, [])
    if (filter.category !== '') {
      filteredTree.forEach((parentCategory, index) => {
        filteredTree[index].options = parentCategory.options.filter(category => (
          category.label.toLowerCase().includes(filter.category.toLowerCase())
        ))
      })
    }
    return filteredTree
  }

  const handleClosePopup = () => {
    setAnchorEl(null)
  }

  const handleOpenPopup = (event, categoryId) => {
    setAnchorEl(popupCategoryId === categoryId && popupIsOpen ? null : event.currentTarget)
    setPopupCategoryId(categoryId)
    setEditCategory(null)
  }

  const handleClickEditCategory = () => {
    setEditCategory(popupCategoryId)
    setAnchorEl(null)
  }

  const handleCloseForm = () => {
    setEditCategory(null)
  }

  const handleDeleteCategory = () => {
    dispatch(deleteCategory(popupCategoryId))
    handleClosePopup()
  }

  const showNewCategoryForm = (topCategoryId) => {
    setEditCategory(topCategoryId)
    setAnchorEl(null)
  }

  const showGroupForm = () => {

  }

  const renderCategory = (categoryId) => {
    const category = budget.categoriesById[categoryId]
    if (editCategory !== null && categoryId === editCategory) {
      return (
        <CategoryForm
          category={category}
          handleCancel={handleCloseForm}
        />
      )
    }
    return (
      <CardHeader
        avatar={<div className={classes.circle} style={{ background: category.colour }} />}
        action={(
          <IconButton aria-label="settings" onClick={event => handleOpenPopup(event, category.id)}>
            <MoreVertIcon />
          </IconButton>
        )}
        title={category.name}
        subheader={`Budget limit: ${category.budgetLimit ? formatCurrency(category.budgetLimit) : 'Not set'}`}
        subheaderTypographyProps={{
          variant: 'caption'
        }}
      />
    )
  }

  const renderNewCategory = (topCategoryId) => {
    if (editCategory !== null && topCategoryId === editCategory) {
      return (
        <Card>
          <CategoryForm
            topCategoryId={topCategoryId}
            handleCancel={handleCloseForm}
          />
        </Card>
      )
    }
    return (
      <Button size="small" color="secondary" onClick={() => showNewCategoryForm(topCategoryId)}>
        New category
        <AddIcon />
      </Button>
    )
  }

  return (
    <Container className={classes.root}>
      <Grid container justify="space-between">
        <Typography variant="h4">Manage categories</Typography>
        <div>
          <InputBase
            type="search"
            placeholder="Search"
            name="category"
            onChange={handleFilterChange}
            value={filter.category}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput
            }}
            inputProps={{
              'aria-label': 'Search categories',
              maxLength: 20
            }}
            startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
          />
          <Select
            placeholder="All groups"
            name="parentCategoryId"
            value={filter.parentCategoryId in budget.categoriesById
              ? {
                label: budget.categoriesById[filter.parentCategoryId].name,
                value: filter.parentCategoryId
              }
              : null
            }
            options={budget.categoryTree.map(cat => ({ label: cat.label, value: cat.id }))}
            inputProps={{ 'aria-label': 'All categories' }}
            onChange={(value) => {
              handleFilterChange({
                target: {
                  name: 'parentCategoryId',
                  value: value === null ? '' : value.value
                }
              })
            }}
            className={classes.filterParentCategory}
            isClearable
          />
          <Tooltip title="New Group">
            <IconButton aria-label="New Group" onClick={showGroupForm}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Grid>
      {filteredCategories().map(topCategory => (
        <Grid container spacing={2} key={topCategory.id} className={classes.categoryGroup}>
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.groupName}>{topCategory.label}</Typography>
            <Tooltip title="Edit Group">
              <IconButton aria-label="Edit Group" onClick={showGroupForm} style={{ padding: 8 }}>
                <EditIcon style={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

          </Grid>
          {topCategory.options.map(category => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={category.id}>
              <Card>{renderCategory(category.id)}</Card>
            </Grid>
          ))}
          <Grid
            item
            lg={3}
            md={4}
            sm={6}
            xs={12}
            key={`add-new-${topCategory.id}`}
            className={classes.newCategoryButton}
          >
            {renderNewCategory(topCategory.id)}
          </Grid>
        </Grid>
      ))}
      <Menu anchorEl={anchorEl} open={popupIsOpen} onClose={handleClosePopup}>
        <MenuList role="menu">
          <MenuItem onClick={handleClickEditCategory}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem onClick={handleDeleteCategory}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </MenuList>
      </Menu>
    </Container>
  )
}

export default BudgetCategories
