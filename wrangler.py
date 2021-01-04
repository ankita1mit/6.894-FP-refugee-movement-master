import pandas as pd
import matplotlib.pyplot as plt
import json
import csv
import numpy as np

def convert_to_csv():
    data = pd.read_csv('assets/csv/all_refugee_data_2.csv', header=0, encoding = "ISO-8859-1")
    # data = data[data['Origin'] == 'Syrian Arab Rep.']
    # data = data[data['Year'] > 2010]
    # data = data[data['Total_Population'] != 0]

    departures = data.groupby(['Origin', 'Year'], as_index=False)['Total_In'].sum()
    arrivals = data.groupby(['Country', 'Year'], as_index=False)['Total_In'].sum()

    departures = departures.rename(
        columns={"Total_In": "Departures", "Origin": "Country"})
    arrivals = arrivals.rename(
        columns={"Total_In": "Arrivals"})

    print(arrivals[(arrivals["Year"] == 1986) & (arrivals["Country"] == "Chile")])
    print(departures[(departures["Year"] == 1986) & (departures["Country"] == "Chile")])

    frames = [departures, arrivals]

    result = departures.merge(arrivals, how="outer")
    result = result.fillna(0)
    result['Net'] = result['Arrivals'] - result['Departures']

    # print(result)

    print(result[(result["Year"] == 1986) & (result["Country"] == "Chile")])

    result.to_csv('test.csv', index=False)


def plot_hist():
    data = pd.read_csv('test.csv', header=0)
    plt.hist(data['Net'], bins=np.arange(min(data['Net']), max(data['Net']), 100))
    plt.show()

def calculate_country_movement():
    country = "Rwanda"
    start_year = 1994
    end_year = 1997

    data = pd.read_csv('assets/csv/all_refugee_data_2.csv', header=0, encoding = "ISO-8859-1")
    print(data.columns)
    data = data[(data["Year"] >= start_year) & (data["Origin"] == country) & (data["Year"] <= end_year)]

    totals = data.groupby(['Origin', 'Year'], as_index=False)['Refugees', 'Asylum',
       'Internally_Displaced_Persons', 'Stateless_Persons',
       'Others_of_Concern', 'Total_Population', 'Total_In', 'Total_IDP'].sum()
    print(totals)

    totals.to_csv('rwanda_totals.csv', index=False)

def calculate_totals():

    data = pd.read_csv('assets/csv/all_refugee_data_2.csv', header=0, encoding = "ISO-8859-1")

    totals = data.groupby(['Year'], as_index=False)['Refugees', 'Asylum',
       'Internally_Displaced_Persons', 'Stateless_Persons',
       'Others_of_Concern', 'Total_Population', 'Total_In', 'Total_IDP'].sum()
    print(totals)

    totals.to_csv('yearly_totals.csv', index=False)

convert_to_csv()
# calculate_country_movement()
# calculate_totals()