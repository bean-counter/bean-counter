/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import grey from '@material-ui/core/colors/grey'

const useStyles = makeStyles((theme) => ({
  formOptions: {
    position: 'sticky',
    top: 64,
    background: 'white',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  smallLabel: {
    fontSize: '0.9rem',
    marginRight: theme.spacing(2)
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  submitButton: {
    marginLeft: theme.spacing(2)
  },
  tableHeaderForm: {
    position: 'sticky',
    top: 138,
    background: theme.palette.info.background
  },
  tableCell: {
    width: 150,
    color: 'white'
  },
  headerRow: {
    background: grey[200],
    fontWeight: 700
  },
  dontImportCell: {
    color: theme.palette.action.disabled
  }
}))

const CsvColumnSelection = ({
  parser,
  handlePrevStep,
  handleNextStep,
  isGeneratingTransactions
}) => {
  const classes = useStyles()
  const [hasHeaderRow, setHasHeaderRow] = useState(parser.hasHeaderRow)
  const [dateFormat, setDateFormat] = useState(parser.dateFormat)
  const [csvHeader, setCsvHeader] = useState(parser.csvHeader)

  const handleChangeColumn = ({ target }) => {
    parser.mapColumnToTransactionField({
      columnIndex: parseInt(target.name, 10),
      transactionField: target.value
    })
    setCsvHeader(() => [...parser.csvHeader])
  }

  const handleChangeDateFormat = ({ target }) => {
    // eslint-disable-next-line no-param-reassign
    parser.dateFormat = target.value
    setDateFormat(parser.dateFormat)
  }

  const handleChangeHasHeaderRow = ({ target }) => {
    // eslint-disable-next-line no-param-reassign
    parser.hasHeaderRow = target.checked
    setHasHeaderRow(parser.hasHeaderRow)
  }

  const selectedColumns = csvHeader.reduce((res, h) => {
    if (h.transactionField === parser.dontImport) return res
    return [...res, h.transactionField]
  }, [])

  const readyToSubmit = [
    'description1',
    'createdAt',
    'amount'
  ].every((column) => selectedColumns.includes(column))
  || [
    'description1',
    'createdAt',
    'income',
    'expense'
  ].every((column) => selectedColumns.includes(column))

  return (
    <form>
      <Grid container alignItems="center" className={classes.formOptions}>
        <Grid item xs={5}>
          <Tooltip title="When checked, this will tell the importer to ignore the header row">
            <FormControlLabel
              className={classes.formField}
              classes={{ label: classes.smallLabel }}
              control={(
                <Checkbox
                  checked={hasHeaderRow}
                  onChange={handleChangeHasHeaderRow}
                  value="hasHeaderRow"
                />
              )}
              label="This file has a header row"
            />
          </Tooltip>
        </Grid>
        <Grid item xs={5}>
          <Tooltip title="This determines how the Date column will be imported">
            <FormControlLabel
              value="Date format"
              label="Date format"
              labelPlacement="start"
              classes={{ label: classes.smallLabel }}
              control={(
                <Select
                  data-testid="selectBox"
                  value={dateFormat}
                  onChange={handleChangeDateFormat}
                  SelectDisplayProps={{ 'data-testid': 'dateFormatDropdown' }}
                  inputProps={{ name: 'dateFormat', 'data-testid': 'dateFormatInput' }}
                >
                  {parser.dateFormats.map((format) => (
                    <MenuItem key={format} value={format}>{format}</MenuItem>
                  ))}
                </Select>
              )}
            >
              <InputLabel htmlFor="dateFormat">Date format</InputLabel>
            </FormControlLabel>
          </Tooltip>
        </Grid>
        <Grid item xs={2}>
          <div className={classes.formActions}>
            <Button
              size="small"
              onClick={handlePrevStep}
              data-testid="backButton"
            >
              Back
            </Button>
            <Tooltip
              title={readyToSubmit ? '' : 'You must first choose the Description, Date and Amount or In/Out columns'}
            >
              <span>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={handleNextStep}
                  disabled={!readyToSubmit || isGeneratingTransactions}
                  className={classes.submitButton}
                  data-testid="nextButton"
                >
                  Next
                </Button>
              </span>
            </Tooltip>
          </div>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} zeroMinWidth>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeaderForm}>
                  Line #
                </TableCell>
                {csvHeader.map(({ label, transactionField }, index) => (
                  <TableCell align="left" key={`${index}-${label}`} className={classes.tableHeaderForm}>
                    <FormControl className={classes.formField}>
                      <Select
                        value={transactionField}
                        onChange={handleChangeColumn}
                        inputProps={{ name: `${index}` }}
                      >
                        <MenuItem key={parser.dontImport} value={parser.dontImport}>
                          <Typography color="textSecondary">{parser.dontImport}</Typography>
                        </MenuItem>
                        {Object.keys(parser.transactionFields).map((field) => (
                          <MenuItem
                            key={field}
                            value={field}
                            dense
                          >
                            {parser.transactionFields[field].label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {parser.csvData.map((row, rowIndex) => (
                <TableRow
                  data-testid={hasHeaderRow && rowIndex === parser.firstRowIndex ? 'headerRow' : null}
                  key={`row=${rowIndex}`}
                >
                  <TableCell
                    className={classNames({
                      [classes.headerRow]: hasHeaderRow && rowIndex === parser.firstRowIndex
                    })}
                  >
                    {rowIndex + 1}
                  </TableCell>
                  {csvHeader.map((_, cellIndex) => (
                    <TableCell
                      key={`cell-${cellIndex}`}
                      className={
                        classNames({
                          [classes.dontImportCell]:
                            csvHeader[cellIndex] !== undefined
                            && csvHeader[cellIndex].transactionField === parser.dontImport,
                          [classes.headerRow]:
                          hasHeaderRow && rowIndex === parser.firstRowIndex
                        })
                      }
                    >
                      {row[cellIndex]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </form>
  )
}

CsvColumnSelection.propTypes = {
  parser: PropTypes.object.isRequired,
  handlePrevStep: PropTypes.func.isRequired,
  handleNextStep: PropTypes.func.isRequired,
  isGeneratingTransactions: PropTypes.bool.isRequired
}

export default CsvColumnSelection
