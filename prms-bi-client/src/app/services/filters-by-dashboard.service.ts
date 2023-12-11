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
    // Replace report's filters with the same target data field.
    try {
      await report.updateFilters(pbi.models.FiltersOperations.Replace, [
        filter,
      ]);
    } catch (errors) {
      console.error(errors);
    }
  }

  applyFilters(report: any, reportName: string) {
    this.filters.forEach((filter: any) => {
      if (filter.reportName == reportName) {
        this.changeFilter(report, filter);
      }
    });
  }
}
