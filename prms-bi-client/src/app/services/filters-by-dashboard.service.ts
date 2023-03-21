import { Injectable } from '@angular/core';
import * as pbi from 'powerbi-client';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FiltersByDashboardService {
  filters = [
    {
      reportName: 'results-dashboard',
      filterData: {
        target: {
          table: 'fact_results',
          column: 'reported_year_id',
        },
        valueAttr: 'year',
      },
    },
    {
      reportName: 'result-dashboard_test',
      filterData: {
        target: {
          table: 'fact_results',
          column: 'reported_year_id',
        },
        valueAttr: 'year',
      },
    },
    {
      reportName: 'result-dashboard_test',
      filterData: {
        target: {
          table: 'fact_results',
          column: 'Type',
        },
        valueAttr: 'resultType',
      },
    },
    {
      reportName: 'cgiar-results-dashboard',
      filterData: {
        target: {
          table: 'fact_results',
          column: 'reported_year_id',
        },
        valueAttr: 'year',
      },
    },
    {
      reportName: 'cgiar-results-dashboard',
      filterData: {
        target: {
          table: 'fact_results',
          column: 'Type',
        },
        valueAttr: 'resultType',
      },
    },
    {
      reportName: 'type-1-report-dashboard',
      filterData: {
        target: {
          table: 'result_initiatives',
          column: 'official_code',
        },
        valueAttr: 'official_code',
      },
    },
    {
      reportName: 'type-1-report-dashboard-test',
      filterData: {
        target: {
          table: 'result_initiatives',
          column: 'official_code',
        },
        valueAttr: 'official_code',
      },
    },
  ];

  constructor(private activatedRoute: ActivatedRoute) {}

  async changeFilter(report: any, filterParams: any) {
    // console.log('Filter');
    // console.log(filterParams?.filterData?.target);
    // console.log(
    //   this.activatedRoute.snapshot.queryParams[
    //     filterParams?.filterData?.valueAttr
    //   ]
    // );
    // if (!filterParams?.values?.length) return;
    const filter = {
      $schema: 'http://powerbi.com/product/schema#basic',
      target: filterParams?.filterData?.target,
      operator: 'In',
      values: [
        this.activatedRoute.snapshot.queryParams[
          filterParams?.filterData?.valueAttr
        ],
      ],
    };

    // console.log(filter);

    // Replace report's filters with the same target data field.
    try {
      await report.updateFilters(pbi.models.FiltersOperations.Replace, [
        filter,
      ]);
      // console.log('Report filters were replaced.');
    } catch (errors) {
      // console.log(errors);
    }
  }

  applyFilters(report: any, reportName: string) {
    // console.log(reportName);
    this.filters.forEach((filter: any) => {
      if (filter.reportName == reportName) {
        this.changeFilter(report, filter);
      }
    });
  }
}
