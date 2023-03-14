import { TimeHelper } from "../../../../common/time.helper";
import { Helper } from "../../../../common/helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { BarChartOptions, ChartColors, LineChartOptions, MultiBarChartOptions, PieChartOptions } from "../../../../modules/charts/chart.options";
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import { createFeelings_DonutChart, getFeelingsColors, getMoodsColors } from "./daily.assessments.stats";
import { createMedicationConsumption_DonutChart, getMedicationStatusCategoryColors } from "./medication.stats";
import { getNutritionQuestionCategoryColors } from "./nutrition.stats";
import {
    addTableRow,
    addRectangularChartImage,
    chartExists,
    constructDonutChartData,
    findKeyCounts,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH,
    SQUARE_CHART_HEIGHT,
    SQUARE_CHART_WIDTH,
    TableRowProperties,
    addSquareChartImageWithLegend,
    addSquareChartImage } from "./report.helper";
import { addSectionTitle, addNoDataDisplay, addLegend } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addSummaryPageAPart1 = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const sectionTitle = 'Lab Values over Past 30 Days';
    const icon = Helper.getIconsPath('body-weight.png');
    y = addSectionTitle(document, y, sectionTitle, icon);

    var useBodyWeightKg = false;
    var startingWeight = model.Stats.Biometrics.LastMonth.BodyWeight.StartingBodyWeight;
    var currentWeight = model.Stats.Biometrics.LastMonth.BodyWeight.CurrentBodyWeight;
    var totalChange = model.Stats.Biometrics.LastMonth.BodyWeight.TotalChange;
    if (model.Stats.CountryCode !== '+91'){
        useBodyWeightKg = true;
        startingWeight = model.Stats.Biometrics.LastMonth.BodyWeight.StartingBodyWeight * 2.20462;
        currentWeight = model.Stats.Biometrics.LastMonth.BodyWeight.CurrentBodyWeight * 2.20462;
        totalChange = model.Stats.Biometrics.LastMonth.BodyWeight.TotalChange * 2.20462;
    }

    const labValues = model.Stats.Biometrics.LastMonth;

    const vals = [];
    vals.push([true, 'Value', 'Starting', 'Current', 'Change']);
    vals.push([false, useBodyWeightKg ? 'Body weight (Kg)' : 'Body weight (lbs)', startingWeight?.toFixed(1), currentWeight?.toFixed(1), totalChange?.toFixed(1)]);
    vals.push([false, 'Blood Glucose (mg/dL)', labValues.BloodGlucose.StartingBloodGlucose, labValues.BloodGlucose.CurrentBloodGlucose, labValues.BloodGlucose.TotalChange]);
    vals.push([false, 'BP (mmHg) - Systolic', labValues.BloodPressure.StartingSystolicBloodPressure, labValues.BloodPressure.CurrentBloodPressureSystolic, labValues.BloodPressure.TotalChangeSystolic]);
    vals.push([false, 'BP (mmHg) - Diastolic', labValues.BloodPressure.StartingDiastolicBloodPressure, labValues.BloodPressure.CurrentBloodPressureDiastolic, labValues.BloodPressure.TotalChangeDiastolic]);
    vals.push([false, 'Total Cholesterol', labValues.Lipids.TotalCholesterol.StartingTotalCholesterol, labValues.Lipids.TotalCholesterol.CurrentTotalCholesterol, labValues.Lipids.TotalCholesterol.TotalCholesterolChange]);
    vals.push([false, 'HDL', labValues.Lipids.HDL.StartingHDL, labValues.Lipids.HDL.CurrentHDL, labValues.Lipids.HDL.TotalHDLChange]);
    vals.push([false, 'LDL', labValues.Lipids.LDL.StartingLDL, labValues.Lipids.LDL.CurrentLDL, labValues.Lipids.LDL.TotalLDLChange]);
    vals.push([false, 'Triglyceride', labValues.Lipids.TriglycerideLevel.StartingTriglycerideLevel, labValues.Lipids.TriglycerideLevel.CurrentTriglycerideLevel, labValues.Lipids.TriglycerideLevel.TotalTriglycerideLevelChange]);
    vals.push([false, 'A1C level', labValues.Lipids.A1CLevel.StartingA1CLevel, labValues.Lipids.A1CLevel.CurrentA1CLevel, labValues.Lipids.A1CLevel.TotalA1CLevelChange]);

    for (var r of vals) {
        const row: TableRowProperties = {
            IsHeaderRow : r[0],
            FontSize    : 11,
            RowOffset   : 23,
            Columns     : [
                {
                    XOffset : 120,
                    Text    : r[1]
                },
                {
                    XOffset : 240,
                    Text    : r[2]
                },
                {
                    XOffset : 320,
                    Text    : r[3]
                },
                {
                    XOffset : 400,
                    Text    : r[4]
                }
            ]
        };
        y = addTableRow(document, y, row);
    }
    return y;
};

export const addSummaryPageAPart2 = (model: any, document: PDFKit.PDFDocument, y: any) => {
    y = addMedicationSummary(y, document, model);
    y = addBodyWeightSummary(y, document, model);
    return y;
};

export const addSummaryPageBPart1 = (model: any, document: PDFKit.PDFDocument, y: any) => {

    y = addNutritionQuestionSummary(y, document, model);
    y = addDailyMovementQuestionSummary(y, document, model);

    return y;
};

export const addSummaryPageBPart2 = (model: any, document: PDFKit.PDFDocument, y: any) => {
    y = addSymptomSummary(y, document, model);
    y = addMoodsSummary(y, document, model);
    return y;
};

export const createSummaryCharts = async (data) => {
    var locations = [];

    var location = await createMedicationConsumption_DonutChart(data.Medication.LastMonth.Daily, 'MedicationsSummary_LastMonth');
    locations.push({
        key : 'MedicationsSummary_LastMonth',
        location
    });
    locations.push(...location);

    location = await createBodyWeight_LineChart(data.Biometrics.LastMonth.BodyWeight.History, 'BodyWeightSummary_LastMonth', data.Biometrics.LastMonth.BodyWeight.CountryCode);
    locations.push({
        key : 'BodyWeightSummary_LastMonth',
        location
    });
    locations.push(...location);

    location = await createNutritionQueryForMonth_GroupedBarChart(data.Nutrition.LastMonth.QuestionnaireStats, 'NutritionQuestionSummary_LastMonth');
    locations.push({
        key : 'NutritionQuestionSummary_LastMonth',
        location
    });
    locations.push(...location);

    location = await createFeelings_DonutChart(data.DailyAssessent.LastMonth, 'SymptomsSummary_LastMonth');
    locations.push({
        key : 'SymptomsSummary_LastMonth',
        location
    });
    locations.push(...location);

    location = await createMoodsSummaryChart_HorizontalBarChart(data.DailyAssessent.LastMonth, 'MoodsSummary_LastMonth');
    locations.push({
        key : 'MoodsSummary_LastMonth',
        location
    });
    locations.push(...location);

    return locations;
};

const createBodyWeight_LineChart = async (stats: any, filename: string, countryCode: string) => {
    if (stats.length === 0) {
        return null;
    }
    var options: LineChartOptions = DefaultChartOptions.lineChart();
    if (countryCode === '+91') {
        var temp = stats.map(c => {
            return {
                x : new Date(c.DayStr),
                y : c.BodyWeight
            };
        });
        options.YLabel = 'Kg';

    } else {
        options.YLabel = 'lbs';
        temp = stats.map(c => {
            return {
                x : new Date(c.DayStr),
                y : c.BodyWeight * 2.20462
            };
        });
    }

    options.Width = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.XAxisTimeScaled = true;

    return await ChartGenerator.createLineChart(temp, options, filename);
};

const createNutritionQueryForMonth_GroupedBarChart = async (stats: any, filename: string) => {
    const qstats = [
        ...(stats.HealthyFoodChoices.Stats),
        ...(stats.HealthyProteinConsumptions.Stats),
        ...(stats.LowSaltFoods.Stats),
    ];
    if (qstats.length === 0) {
        return null;
    }
    const temp = qstats.map(c => {
        return {
            x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
            y : c.Response,
            z : c.Type,
        };
    });
    const categoryColors = getNutritionQuestionCategoryColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);

    const options: MultiBarChartOptions =  DefaultChartOptions.multiBarChart();
    options.Width           = RECTANGULAR_CHART_WIDTH;
    options.Height          = RECTANGULAR_CHART_HEIGHT;
    options.YLabel          = 'User Response';
    options.CategoriesCount = categories.length;
    options.Categories      = categories;
    options.Colors          = colors;
    options.FontSize        = '9px';
    options.ShowYAxis       = false;

    return await ChartGenerator.createGroupBarChart(temp, options, filename);
};

const createMoodsSummaryChart_HorizontalBarChart = async (stats: any, filename: string) => {

    if (stats.length === 0) {
        return null;
    }
    const moods_ = stats.map(x => x.Mood);
    const tempMoods = findKeyCounts(moods_);
    const moods = Helper.sortObjectKeysAlphabetically(tempMoods);
    //const moodsColors = getMoodsColors();
    //const colors = moodsColors.map(x => x.Color);
    const options: BarChartOptions = DefaultChartOptions.barChart();
    options.Width  = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.YLabel = 'Moods';
    options.Color  = ChartColors.DodgerBlue;
    var data = [];
    for (var k of Object.keys(moods)) {
        var m = {
            x: k,
            y: moods[k]
        }
        data.push(m);
    }
    return await ChartGenerator.createBarChart(data, options, filename);
};

//#region Add to PDF

function addNutritionQuestionSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'NutritionQuestionSummary_LastMonth';
    const detailedTitle = 'Nutrition Question Summary for Last Month';
    const titleColor = '#505050';
    const sectionTitle = 'Nutrition Question Summary';
    const icon = Helper.getIconsPath('nutrition.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;
        const colors = getNutritionQuestionCategoryColors();
        const legend = colors.map(x => {
            return {
                Key   : x.Key + ': ' + x.Question,
                Color : x.Color,
            };
        });
        y = addLegend(document, y, legend, 125, 11, 50, 10, 15);
    }
    return y;
}

function addDailyMovementQuestionSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'Exercise_Questionnaire_Overall_LastMonth';
    const detailedTitle = 'Daily Movement Question Summary for Last Month';
    const titleColor = '#505050';
    const sectionTitle = 'Daily Movement Question Summary';
    const icon = Helper.getIconsPath('exercise.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        if (!chartExists(model, chartImage)) {
            y = addNoDataDisplay(document, y);
        } else {
            y = addSquareChartImage(document, model, chartImage, y, detailedTitle, titleColor, 165, 225);
        }
    }
    return y;
}

function addMedicationSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'MedicationsSummary_LastMonth';
    const detailedTitle = 'Medication Adherence for Last Month';
    const titleColor = '#505050';
    const sectionTitle = 'Medication Adherence Summary';
    const icon = Helper.getIconsPath('medications.png');
    const legend = getMedicationStatusCategoryColors();
    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 8;
        y = addSquareChartImageWithLegend(document, model, chartImage, y, detailedTitle, titleColor, legend);
        y = y + 7;
    }
    return y;
}

function addBodyWeightSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'BodyWeightSummary_LastMonth';
    const detailedTitle = 'Body weight for Last Month';
    const titleColor = '#505050';
    const sectionTitle = 'Body weight Summary';
    const icon = Helper.getIconsPath('body-weight.png');
    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 8;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor, );
        y = y + 7;
    }
    return y;
}

function addSymptomSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'SymptomsSummary_LastMonth';
    const detailedTitle = 'Relative Symptoms over Past 30 Days';
    const titleColor = '#505050';
    const sectionTitle = 'Relative Symptoms';
    const icon = Helper.getIconsPath('feelings.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        const legend = getFeelingsColors();
        y = addSquareChartImageWithLegend(document, model, chartImage, y, detailedTitle, titleColor, legend, 40, 150);
    }
    return y;
}

function addMoodsSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'MoodsSummary_LastMonth';
    const detailedTitle = 'Moods over Past 30 Days';
    const titleColor = '#505050';
    // const sectionTitle = 'Summary of Moods';
    // const icon = Helper.getIconsPath('feelings.png');

    // y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addSquareChartImage(document, model, chartImage, y, detailedTitle, titleColor);
    }
    return y;
}

//#endregion 
