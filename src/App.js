import {Component} from 'react'

import {TiArrowSortedUp, TiArrowSortedDown} from 'react-icons/ti'

import './App.css'

let commentsDetailsArray

class App extends Component {
  state = {
    commentsDetails: [],
    pagenationOption: 25,
    searchInput: '',
    sortingDirection: '',
    sortColumn: '',
    currentPage: 1,
  }

  componentDidMount() {
    this.getCommentDetails()
  }

  getCommentDetails = async () => {
    const url = `https://dev.ylytic.com/ylytic/test`

    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)

    const data = await response.json()

    const {comments} = data

    this.setState({commentsDetails: comments})
    commentsDetailsArray = comments
  }

  onChangeSearchInput = e => {
    this.setState({searchInput: e.target.value})
  }

  onChangeOption = e => {
    this.setState({pagenationOption: e.target.value})
  }

  sortDataOnValue = () => {
    const {sortColumn, sortingDirection, commentsDetails} = this.state

    const sortedData = commentsDetailsArray.sort((a, b) => {
      if (sortColumn === 'at') {
        return sortingDirection === 'asc'
          ? new Date(a.at) - new Date(b.at)
          : new Date(b.at) - new Date(a.at)
      }
      if (sortColumn === 'like') {
        return sortingDirection === 'asc' ? a.like - b.like : b.like - a.like
      }
      if (sortColumn === 'reply') {
        return sortingDirection === 'asc' ? a.like - b.like : b.like - a.like
      }

      return sortingDirection === 'asc'
        ? a[sortColumn].localeCompare(b[sortColumn])
        : b[sortColumn].localeCompare(a[sortColumn])
    })

    this.setState({commentsDetails: sortedData})
  }

  sortByColumnAndUpdateData = () => {
    const {sortColumn, sortingDirection, commentsDetails} = this.state

    this.sortDataOnValue()
  }

  onSortByColumn = async colName => {
    const {sortColumn, sortingDirection} = this.state

    if (sortColumn === colName) {
      await this.setState({
        sortColumn: colName,
        sortingDirection: sortingDirection === 'desc' ? 'asc' : 'desc',
      })

      this.sortByColumnAndUpdateData()
    } else {
      await this.setState({sortColumn: colName, sortingDirection: 'asc'})
      this.sortByColumnAndUpdateData()
    }
  }

  onMoveToNextSlide = value => {
    const {commentsDetails, currentPage, pagenationOption} = this.state

    const startIndex = (value - 1) * pagenationOption
    const endIndex = startIndex + pagenationOption

    const filteredData = commentsDetailsArray.slice(startIndex, endIndex)

    this.setState({commentsDetails: filteredData, currentPage: value})
  }

  displayPagenationButtons = arr => {
    const {currentPage} = this.state

    return (
      <>
        {arr.map(btn => (
          <button
            onClick={() => this.onMoveToNextSlide(btn)}
            id={btn}
            className={
              currentPage === btn ? 'active-pagenate-button' : 'pagenate-button'
            }
            type="button"
          >
            {btn}
          </button>
        ))}
      </>
    )
  }

  render() {
    const {
      commentsDetails,
      searchInput,
      sortingDirection,
      sortColumn,
      pagenationOption,
      currentPage,
    } = this.state

    const pagenatedCommentedDetails = commentsDetails
      .slice(0, pagenationOption)
      .filter(
        item =>
          item.author.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.text.toLowerCase().includes(searchInput.toLowerCase()),
      )

    const numberOfButtons = 100 / pagenationOption

    const pagenationArray = []

    for (let i = 1; i <= numberOfButtons; i = i + 1) {
      pagenationArray.push(i)
    }

    return (
      <div className="comments-container">
        <h1 className="comments-heading">Comments</h1>
        <div className="input-container">
          <input
            onChange={this.onChangeSearchInput}
            value={searchInput}
            className="search-input"
            type="search"
            placeholder="Filter"
          />
          <div className="pagenation-table-container">
            <select
              onChange={this.onChangeOption}
              className="drop-down-pagination"
            >
              <option value={25}>25 per Page</option>
              <option value={50}>50 per Page</option>
              <option value={100}>100 per Page</option>
            </select>
          </div>
        </div>
        <div className="pagenation-lg-btn-container">
          <div className="pagenation-button-container">
            <button
              onClick={() => this.onMoveToNextSlide(1)}
              type="button"
              className="pagenation-first-button"
            >
              First
            </button>

            {this.displayPagenationButtons(pagenationArray)}
            <button
              onClick={() => this.onMoveToNextSlide(100 / pagenationOption)}
              type="button"
              className="pagenation-first-button"
            >
              Last
            </button>
          </div>
        </div>
        <table className="comments-table">
          <thead>
            <tr className="header-row">
              <th>
                <div className="header-row-container">
                  <span>at</span>
                  <span className="sorted-container">
                    <button
                      type="button"
                      onClick={() => this.onSortByColumn('at')}
                      className="sorted-button"
                    >
                      <TiArrowSortedUp className="sort-icon" />

                      <TiArrowSortedDown className="sort-icon" />
                    </button>
                  </span>
                </div>
              </th>
              <th className="header">
                <div className="header-row-container">
                  <span>author</span>
                  <span className="sorted-container">
                    <button
                      type="button"
                      onClick={() => this.onSortByColumn('author')}
                      className="sorted-button"
                    >
                      <TiArrowSortedUp className="sort-icon" />

                      <TiArrowSortedDown className="sort-icon" />
                    </button>
                  </span>
                </div>
              </th>
              <th className="header">
                <div className="header-row-container">
                  <span>like</span>
                  <span className="sorted-container">
                    <button
                      type="button"
                      onClick={() => this.onSortByColumn('like')}
                      className="sorted-button"
                    >
                      <TiArrowSortedUp className="sorted-icon" />

                      <TiArrowSortedDown className="sorted-icon" />
                    </button>
                  </span>
                </div>
              </th>
              <th className="header">
                <div className="header-row-container">
                  <span>reply</span>
                  <span className="sorted-container">
                    <button
                      onClick={() => this.onSortByColumn('reply')}
                      className="sorted-button"
                      type="button"
                    >
                      <TiArrowSortedUp className="sorted-icon" />

                      <TiArrowSortedDown className="sorted-icon" />
                    </button>
                  </span>
                </div>
              </th>
              <th className="header">
                <div className="header-row-container">
                  <span>text</span>
                  <span className="sorted-container">
                    <button
                      type="button"
                      onClick={() => this.onSortByColumn('text')}
                      className="sorted-button"
                    >
                      <TiArrowSortedUp className="sort-icon" />

                      <TiArrowSortedDown className="sort-icon" />
                    </button>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {pagenatedCommentedDetails.map(item => (
              <>
                <tr className="cell-row">
                  <td>{item.at}</td>
                  <td>{item.author}</td>
                  <td>{item.like}</td>
                  <td>{item.reply}</td>
                  <td>{item.text}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
        <div className="pagenation-button-container">
          <button
            onClick={() => this.onMoveToNextSlide(1)}
            type="button"
            className="pagenation-first-button"
          >
            First
          </button>

          {this.displayPagenationButtons(pagenationArray)}
          <button
            onClick={() => this.onMoveToNextSlide(100 / pagenationOption)}
            type="button"
            className="pagenation-first-button"
          >
            Last
          </button>
        </div>
      </div>
    )
  }
}

export default App
