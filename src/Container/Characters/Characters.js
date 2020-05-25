import React from "react";
import "./Characters.css";
import loader from "../../loader.gif";
import Badge from "../../Components/Badge/Badge";
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
  //   Fetch filter list to be displayed
  getUniqueFilters = (array, parentKey, childrenKey) => {
    const uniqueFilter = array.map((item) => {
      return childrenKey ? item[parentKey][childrenKey] : item[parentKey];
    });
    return [...new Set(uniqueFilter)];
  };
  //   On clicking filter checkbox
  handleFilter = (event, type) => {
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
        type: type,
      });
    }
    this.setState({ appliedFilter: appliedFilterData }, () =>
      this.applyFilters()
    );
  };
  //   Apply filters after checking results of searched and sorted data
  applyFilters = () => {
    const { appliedFilter, searchString, sortOrder } = this.state;
    let result = [];
    let syncedData = [...resultData];
    if (searchString || sortOrder) {
      syncedData = this.syncFilterData(searchString, sortOrder);
    }
    for (let i = 0; i < appliedFilter.length; i++) {
      let data = syncedData.filter((item) => {
        return (
          appliedFilter[i]["label"] === item[appliedFilter[i]["type"]] ||
          appliedFilter[i]["label"] === item[appliedFilter[i]["type"]].name
        );
      });
      result = [...result, ...data];
      // To display unique results
      result = [...new Set(result)];
    }
    this.setState({ results: appliedFilter.length ? result : syncedData });
  };
  handleSearch = (event) => {
    const searchString = event.target.value;
    if (this.state.appliedFilter.length) {
      this.setState({ searchString: searchString }, () => this.applyFilters());
    } else {
      const filterData = this.syncFilterData(
        searchString,
        this.state.sortOrder
      );
      this.setState({ searchString: searchString, results: filterData });
    }
  };
  handleSort = (event) => {
    const sortValue = event.target.value;
    if (this.state.appliedFilter.length) {
      this.setState(
        {
          sortOrder: sortValue,
        },
        () => this.applyFilters()
      );
    } else {
      const filterData = this.syncFilterData(
        this.state.searchString,
        sortValue
      );
      this.setState({ sortOrder: sortValue, results: filterData });
    }
  };
  //   keep searched and sorted data in Sync
  syncFilterData = (searchString, sortOrder) => {
    let filterData = resultData.filter((item) =>
      item.name.toUpperCase().includes(searchString.toUpperCase())
    );
    if (sortOrder === "desc") return filterData.reverse();
    else return filterData.sort();
  };
  removeFilter = (filterId) => {
    this.handleFilter({ target: { id: filterId } });
  };
  isFilterChecked = (filterId) => {
    let index = this.state.appliedFilter.findIndex(
      (item) => item.id === filterId
    );
    return index > -1 ? true : false;
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
                  handleCheckbox={(event) =>
                    this.handleFilter(event, "species")
                  }
                  key={`species-${item}`}
                  isChecked={this.isFilterChecked(`species-${item}`)}
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
                  handleCheckbox={(event) => this.handleFilter(event, "gender")}
                  key={`gender-${item}`}
                  isChecked={this.isFilterChecked(`gender-${item}`)}
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
                  handleCheckbox={(event) => this.handleFilter(event, "origin")}
                  key={`origin-${item}`}
                  isChecked={this.isFilterChecked(`origin-${item}`)}
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
                <Badge
                  text={item.label}
                  icon="fa-times"
                  key={key}
                  handleClick={() => this.removeFilter(item.id)}
                />
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
