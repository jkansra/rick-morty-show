import React from "react";
import "./Characters.css";
import loader from "../../loader.gif";
import Badge from "../../Components/Badge/Badge";
import Button from "../../Components/Button/Button";
import Checkbox from "../../Components/Checkbox/Checkbox";
import Card from "../../Components/Card/Card";
import Input from "../../Components/Input/Input";
import Select from "../../Components/Select/Select";
import { getYearDifference } from "../../Utils/Utils";
import { options } from "../../Constants/Constants";

let resultData = [];
class Characters extends React.Component {
  state = {
    results: [],
    isLoading: false,
    filters: {
      species: [],
      gender: [],
      origin: [],
    },
    appliedFilter: [],
    sortOrder: "",
    searchString: "",
  };
  componentDidMount() {
    this.setState({ isLoading: true });
    fetch("https://rickandmortyapi.com/api/character/")
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        if (data.results) {
          let results = data.results;
          //   Taking dummy data of 40 results to work
          fetch("https://rickandmortyapi.com/api/character/?page=2")
            .then((results) => {
              return results.json();
            })
            .then((data) => {
              if (data.results) {
                results = [...results, ...data.results];
              }
              resultData = results;
              //   Fetch filters
              const species = this.getUniqueFilters(results, "species");
              const gender = this.getUniqueFilters(results, "gender");
              const origin = this.getUniqueFilters(results, "origin", "name");
              this.setState({
                results: results,
                filters: {
                  ...this.state.filters,
                  species,
                  gender,
                  origin,
                },
                isLoading: false,
              });
            });
        }
      });
  }
  getUniqueFilters = (array, parentKey, childrenKey) => {
    const uniqueFilter = array.map((item) => {
      return childrenKey ? item[parentKey][childrenKey] : item[parentKey];
    });
    return [...new Set(uniqueFilter)];
  };
  handleFilter = (event) => {
    let value = event.target.value;
    let id = event.target.id;
    const appliedFilterData = [...this.state.appliedFilter];
    let index = appliedFilterData.findIndex(
      (item) => item.id === event.target.id
    );
    if (index > -1) {
      appliedFilterData.splice(index, 1);
    } else {
      appliedFilterData.push({
        label: value,
        id: id,
      });
    }
    this.setState({ appliedFilter: appliedFilterData }, () =>
      this.applyFilters()
    );
  };
  applyFilters = () => {
    const { appliedFilter } = this.state;
    let result = [];
    console.log(appliedFilter);
    if (appliedFilter && appliedFilter.length > 0) {
      for (let i = 0; i < resultData.length; i++) {
        for (let j = 0; j < appliedFilter.length; j++) {
          let id = this.getSubstringFromId(appliedFilter[j].id);
          if (resultData[i][id] === appliedFilter[j].label) {
            result.push(resultData[i]);
          }
        }
      }
      this.setState({ results: result });
    } else {
      this.setState({ results: resultData });
    }
  };
  getSubstringFromId = (id) => id.substring(0, id.indexOf("-"));
  handleSearch = (event) => {
    const searchString = event.target.value;
    const filterData = this.syncFilterData(searchString, this.state.sortOrder);
    this.setState({ results: filterData, searchString: searchString });
  };
  handleSort = (event) => {
    const sortValue = event.target.value;
    const filterData = this.syncFilterData(this.state.searchString, sortValue);
    this.setState({
      results: filterData,
      sortOrder: sortValue,
    });
  };
  syncFilterData = (searchString, sortOrder) => {
    // const { results, appliedFilter } = this.state;
    // let displayData = [];
    // if (appliedFilter.length > 0) {
    //   displayData = results;
    // } else {
    //   displayData = [...resultData];
    // }
    // console.log("display data", displayData);
    let filterData = resultData.filter((item) =>
      item.name.toUpperCase().includes(searchString.toUpperCase())
    );
    if (sortOrder === "desc") return filterData.reverse();
    else if (sortOrder === "asc") return filterData.sort();
    else return filterData;
  };
  render() {
    const { filters, results, appliedFilter, isLoading } = this.state;
    if (isLoading) return <img src={loader} alt="loader" className="loader" />;
    return (
      <div className="container">
        {/* Filter Section at the Left */}
        <div className="container__filters">
          <h1 className="container__filters__heading container__filters--mbl">
            Filters
          </h1>
          <div className="container__filters__type container__filters--mbl">
            <h2 className="container__filters--mbs">Species</h2>
            {filters.species.map((item) => {
              return (
                <Checkbox
                  label={item}
                  id={`species-${item}`}
                  handleCheckbox={this.handleFilter}
                  key={`species-${item}`}
                />
              );
            })}
          </div>
          <div className="container__filters__type container__filters--mbl">
            <h2 className="container__filters--mbs">Gender</h2>
            {filters.gender.map((item) => {
              return (
                <Checkbox
                  label={item}
                  id={`gender-${item}`}
                  handleCheckbox={this.handleFilter}
                  key={`gender-${item}`}
                />
              );
            })}
          </div>
          <div className="container__filters__type">
            <h2 className="container__filters--mbs">Origin</h2>
            {filters.origin.map((item) => {
              return (
                <Checkbox
                  label={item}
                  id={`origin-${item}`}
                  handleCheckbox={this.handleFilter}
                  key={`origin-${item}`}
                />
              );
            })}
          </div>
        </div>
        {/* Content Section at the Right */}
        <div className="container__content">
          {/* Selected Filters */}
          {appliedFilter && appliedFilter.length > 0 ? (
            <div className="container__content__selected container__filters--mbl">
              <h1 className="container__filters__heading container__filters--mbs">
                Selected Filters
              </h1>
              {appliedFilter.map((item, key) => (
                <Badge text={item.label} icon="fa-times" key={key} />
              ))}
            </div>
          ) : null}
          {/* SEARCH AND SORT */}
          <div className="container__content__search__sort container__filters--mbs">
            <div className="container__content__search">
              <Input
                name="search"
                id="search"
                placeholder="Search by Name"
                handleChange={this.handleSearch}
              />
            </div>
            <div className="container__content__sort">
              <Select options={options} handleChange={this.handleSort} />
            </div>
          </div>
          {/* Character Cards */}
          {results && results.length > 0 ? (
            <div className="container__content__characters">
              {results.map((result) => (
                <Card
                  name={result.name}
                  id={result.id}
                  status={result.status}
                  species={result.species}
                  gender={result.gender}
                  origin={result.origin.name}
                  location={result.location.name}
                  image={result.image}
                  created={getYearDifference(result.created)}
                  key={result.id}
                />
              ))}
            </div>
          ) : (
            <h1 className="no-data">No Characters Available</h1>
          )}
        </div>
      </div>
    );
  }
}

export default Characters;
