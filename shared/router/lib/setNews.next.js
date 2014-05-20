'use strict';

define('setNews', [], () => {
  return (sort) => {
    var cap = sort.charAt(0).toUpperCase() + sort.slice(1);
    Session.set('sortType', sort);
    Session.set('currentView', cap + ' News');
  };
});