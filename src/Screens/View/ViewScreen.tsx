import { RouteProp, useFocusEffect, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    InteractionManager,
    TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'Components/Card/Card';
import { AppContext } from 'Context/AppContext';
import { AppStackParamList } from 'Navigation/AppNavigation';
import { EditNavProps, EditRoute } from 'Screens/Edit';

import { CalendarList, DateObject } from 'react-native-calendars';
import moment from 'moment';
import { GradientColours, GreyColours } from 'Styles/Colours';
import { IHabit, mergeDates } from 'Controllers/HabitController';
import { notificationAsync, NotificationFeedbackType } from 'expo-haptics';
import DisplayDay, { displayDays } from 'Components/DisplayDay';
import { ScheduleType, ScheduleTypeValue } from 'Components/Scheduler';
import Icon from 'Components/Icon';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import ProgressCircle, { getProgress } from 'Components/ProgressCircle';
import HeaderBackground from 'Headers/HeaderBackground';

export type ViewNavProps = StackNavigationProp<AppStackParamList, 'View'>;
export type ViewRoute = RouteProp<AppStackParamList, 'View'>;

interface EditProps {
    navigation: EditNavProps;
    route: EditRoute;
}

export default function ViewScreen({ navigation, route }: EditProps) {
    const { colors } = useTheme();

    // Habit state
    // const { habits, updateHabit } = useContext(AppContext);
    // const { id } = route.params;
    const habit = route.params.habit;

    console.log(habit.gradient);

    // Updates the header to reflect the current gradient
    useEffect(() => {
        navigation.setOptions({
            headerBackground: () => <HeaderBackground colour={habit.gradient} />,
        });
    }, [habit.gradient]);

    // Ready state
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsReady(true);
        });
    }, []);

    // Day state
    const [day, setDay] = useState<ScheduleTypeValue>(getInitialDate(habit.schedule));
    const [date, setDate] = useState(today);
    const [month, setMonth] = useState(today);
    const allDates = Object.keys(habit.dates);
    const sortedDates = sortDates(allDates);
    let markedDates = getMarkedDates(habit, month, allDates);

    // Progress from child
    const [circleProgress, setCircleProgress] = useState(getProgress(habit, date));

    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({
                title: habit.name,
            });
        }, [navigation, habit.name])
    );

    const handleCalendarPress = (day: DateObject) => {
        const date = habit.dates[day.dateString];
        const newProgress = date && date.progress >= date.progressTotal ? 0 : habit.progressTotal;

        updateHabit({
            ...habit,
            dates: mergeDates(habit.dates, day.dateString, newProgress, habit.progressTotal),
        });
        notificationAsync(NotificationFeedbackType.Success);
    };

    const getAlphaValue = (index: number) => {
        let indexDate = moment()
            .subtract(6 - index, 'd')
            .format('YYYY-MM-DD');

        if (indexDate == date) {
            // return 0.2;

            return circleProgress >= habit.progressTotal
                ? 0
                : 1 - circleProgress / habit.progressTotal;
        }

        return habit.dates[indexDate]
            ? habit.dates[indexDate].progress >= habit.progressTotal
                ? 0
                : 1 - habit.dates[indexDate].progress / habit.progressTotal
            : 1;
    };

    const getYearAlphaValue = (day: string) => {
        let value: number | string = habit.dates[day]
            ? habit.dates[day].progress >= habit.dates[day].progressTotal
                ? 1
                : habit.dates[day].progress / habit.dates[day].progressTotal
            : 1;

        value = (Math.round(value * 10) / 10) * 100;
        if (value <= 10) value = 20;
        if (value === 100) value = '';

        return value;
    };

    const handleDayChange = (day: ScheduleTypeValue, index: number) => {
        const dayString = moment().subtract(index, 'd').format('YYYY-MM-DD');
        setDay(day);
        setDate(dayString);
        // setProgress(habit.dates[dayString] ? habit.dates[dayString].progress : 0);
    };

    const getCurrentStreak = (date: string) => {
        let currentStreak = 0;
        let dayPointerIndex = 0;
        let dayPointer = moment(date)
            .subtract(dayPointerIndex + 1, 'd')
            .format('YYYY-MM-DD');

        let dayIndex = moment(dayPointer).format('ddd').toUpperCase();

        do {
            if (
                habit.dates[dayPointer] &&
                habit.dates[dayPointer].progress >= habit.dates[dayPointer].progressTotal
            ) {
                currentStreak++;
            }
            dayPointerIndex++;
            dayPointer = moment(date)
                .subtract(dayPointerIndex + 1, 'd')
                .format('YYYY-MM-DD');
            dayIndex = moment(dayPointer).format('ddd').toUpperCase();
        } while (
            (habit.dates[dayPointer] &&
                habit.dates[dayPointer].progress >= habit.dates[dayPointer].progressTotal) ||
            habit.schedule[dayIndex as ScheduleTypeValue] === false
        );

        if (
            (habit.dates[date] && habit.dates[date].progress >= habit.dates[date].progressTotal) ||
            habit.schedule[dayIndex as ScheduleTypeValue] === false
        ) {
            currentStreak++;
        }

        return { currentStreak, dayPointer };
    };

    const getHighestStreak = () => {
        let highestStreak = 0;

        if (sortedDates.length > 0) {
            let dayPointer = today;
            let streak = getCurrentStreak(dayPointer);

            if (streak.currentStreak > highestStreak) {
                highestStreak = streak.currentStreak;
            }
            dayPointer = streak.dayPointer;

            do {
                do {
                    dayPointer = moment(dayPointer).subtract(1, 'd').format('YYYY-MM-DD');
                } while (
                    habit.dates[dayPointer] &&
                    habit.dates[dayPointer].progress < habit.dates[dayPointer].progressTotal
                );

                let streak = getCurrentStreak(dayPointer);
                dayPointer = streak.dayPointer;

                if (streak.currentStreak > highestStreak) {
                    highestStreak = streak.currentStreak;
                }
            } while (new Date(dayPointer).getTime() >= new Date(sortedDates[0]).getTime());
        }

        return highestStreak;
    };

    const getTotalComplete = () => {
        return Object.keys(markedDates).filter((date) => markedDates[date].selected == true).length;
    };

    const getCompletionRate = () => {
        const startDate = moment(sortedDates[0]);

        const daysToDisable = getDaysToDisable(habit);

        let unselectedDays = 0;
        let completedDays = getTotalComplete();

        let totalDays = moment().add(1, 'd').diff(startDate, 'd');

        if (totalDays == 0) {
            totalDays = 1;
        }

        for (let m = startDate.clone(); m.diff(moment()) <= 0; m.add(1, 'days')) {
            if (daysToDisable.includes(m.day())) {
                const markedDate = markedDates[m.format('YYYY-MM-DD')];
                if (markedDate && markedDate.selected) {
                    unselectedDays++;
                } else {
                    completedDays++;
                }
            }
        }

        totalDays -= unselectedDays;
        completedDays -= unselectedDays;

        const completionRate = (completedDays / totalDays) * 100;

        return Math.round(completionRate * 10) / 10;
    };

    const updateHabitAsync = (progress: number) => {
        updateHabitDebounced(progress);
    };

    const updateHabitDebounced = AwesomeDebouncePromise(
        (progress: number) =>
            updateHabit({
                ...habit,
                dates: mergeDates(habit.dates, date, progress, habit.progressTotal),
            }),
        200
    );

    // const scrollRef = useRef<ScrollView>(null);

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 20,
                    paddingBottom: 0,
                }}>
                {displayDays.map((displayDay, index) => {
                    const date = moment()
                        .subtract(6 - index, 'd')
                        .format('YYYY-MM-DD');

                    const markedDate = markedDates[date];

                    return (
                        <DisplayDay
                            key={displayDay + index}
                            disabled={markedDate && markedDate.disabled}
                            alpha={getAlphaValue(index)}
                            selectedDay={day}
                            displayDay={displayDay as ScheduleTypeValue}
                            displayIndex={index}
                            gradient={habit.gradient}
                            handleDayChange={handleDayChange}
                        />
                    );
                })}
            </View>

            <ProgressCircle
                habit={habit}
                date={date}
                progress={getProgress(habit, date)}
                gradient={GradientColours[habit.gradient].solid}
                updateHabit={updateHabitAsync}
                setCircleProgress={setCircleProgress}
            />

            <Text
                style={{
                    fontFamily: 'Montserrat_600SemiBold',
                    fontSize: 20,
                    padding: 15,
                    textAlign: 'center',
                    color: colors.text,
                }}>
                Yearly Progress
            </Text>

            <View style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <View
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        height: 7 * 7,
                    }}>
                    {yearDateArray.map((day, index) => {
                        return (
                            <View
                                key={index + day}
                                style={{
                                    height: yearlyDateDimensions,
                                    width: yearlyDateDimensions,
                                    backgroundColor:
                                        habit.dates[day] && habit.dates[day].progress > 0
                                            ? GradientColours[habit.gradient].solid +
                                              getYearAlphaValue(day)
                                            : colors.border,
                                    margin: 0.9,
                                    borderRadius: 1,
                                }}
                            />
                        );
                    })}
                </View>
            </View>

            <Text
                style={{
                    fontFamily: 'Montserrat_600SemiBold',
                    fontSize: 20,
                    padding: 15,
                    textAlign: 'center',
                    color: colors.text,
                }}>
                Stats
            </Text>

            <View style={{ display: 'flex', flexDirection: 'row', marginRight: 15 }}>
                <Card
                    title='Current Streak'
                    themeText={true}
                    style={{ ...styles.statCard, marginTop: 0 }}>
                    <View
                        style={[
                            styles.statBar,
                            {
                                backgroundColor: GradientColours[habit.gradient].solid,
                            },
                        ]}
                    />
                    <View style={styles.statIconContainer}>
                        <Icon family='fontawesome5' name='fire' colour={colors.text} size={30} />
                        <Text
                            style={[
                                styles.statIconText,
                                {
                                    color: colors.text,
                                },
                            ]}>
                            {isReady && getCurrentStreak(today).currentStreak}
                        </Text>
                    </View>
                </Card>
                <Card
                    title='Highest Streak'
                    themeText={true}
                    style={{ ...styles.statCard, marginTop: 0 }}>
                    <View
                        style={[
                            styles.statBar,
                            {
                                backgroundColor: GradientColours[habit.gradient].solid,
                            },
                        ]}
                    />
                    <View style={styles.statIconContainer}>
                        <Icon family='fontawesome5' name='crown' colour={colors.text} size={30} />
                        <Text
                            style={[
                                styles.statIconText,
                                {
                                    color: colors.text,
                                },
                            ]}>
                            {isReady && getHighestStreak()}
                        </Text>
                    </View>
                </Card>
            </View>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginRight: 15,
                    marginBottom: 15,
                }}>
                <Card title='Total Complete' themeText={true} style={styles.statCard}>
                    <View
                        style={[
                            styles.statBar,
                            {
                                backgroundColor: GradientColours[habit.gradient].solid,
                            },
                        ]}
                    />
                    <View style={styles.statIconContainer}>
                        <Icon family='fontawesome5' name='check' colour={colors.text} size={30} />
                        <Text
                            style={[
                                styles.statIconText,
                                {
                                    color: colors.text,
                                },
                            ]}>
                            {isReady && getTotalComplete()}
                        </Text>
                    </View>
                </Card>
                <Card title='Completion Rate' themeText={true} style={styles.statCard}>
                    <View
                        style={[
                            styles.statBar,
                            {
                                backgroundColor: GradientColours[habit.gradient].solid,
                            },
                        ]}
                    />
                    <View style={styles.statIconContainer}>
                        <Icon
                            family='fontawesome5'
                            name='percentage'
                            colour={colors.text}
                            size={30}
                        />
                        <Text
                            style={[
                                styles.statIconText,
                                {
                                    color: colors.text,
                                },
                            ]}>
                            {isReady && getCompletionRate()}
                        </Text>
                    </View>
                </Card>
            </View>

            {isReady && (
                <CalendarList
                    key={habit.gradient}
                    horizontal={true}
                    pagingEnabled={true}
                    maxDate={today}
                    markedDates={markedDates}
                    onDayPress={handleCalendarPress}
                    markingType={'custom'}
                    firstDay={1}
                    onVisibleMonthsChange={(months: DateObject[]) => setMonth(months[0].dateString)}
                    // onMonthChange={}
                    theme={{
                        calendarBackground: colors.background,
                        monthTextColor: colors.text,
                        dayTextColor: colors.text,
                        textDisabledColor: colors.border,
                        selectedDayTextColor: colors.text,
                        selectedDotColor: colors.text,
                        selectedDayBackgroundColor: GradientColours[habit.gradient].solid,
                        todayTextColor: GradientColours[habit.gradient].solid,
                        dotColor: GradientColours[habit.gradient].solid,
                        textMonthFontFamily: 'Montserrat_600SemiBold',
                        textDayFontFamily: 'Montserrat_600SemiBold',
                        textDayHeaderFontFamily: 'Montserrat_600SemiBold',
                        textSectionTitleColor: GreyColours.GREY2,
                    }}
                />
            )}

            <TouchableOpacity
                style={{ padding: 30 }}
                onPress={() => updateHabit({ ...habit, dates: {} })}>
                <Text style={{ color: 'red' }}>Reset</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// Constants
const today = moment().format('YYYY-MM-DD');
const yearDateArray = Array.from(Array(365)).map((value, index) =>
    moment().subtract(364, 'd').add(index, 'd').format('YYYY-MM-DD')
);
const yearlyDateDimensions = (Dimensions.get('screen').width - 60) / 53 - 1;

// Helper functions
const sortDates = (allDates: string[]) => {
    return allDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
};

const getInitialDate = (schedule: ScheduleType): ScheduleTypeValue => {
    for (let i = displayDays.length - 1; i >= 0; i--) {
        if (schedule[displayDays[i] as ScheduleTypeValue]) {
            return displayDays[i] as ScheduleTypeValue;
        }
    }

    return displayDays[0] as ScheduleTypeValue;
};

const getDaysToDisable = (habit: IHabit) => {
    let unselectedDays: number[] = [];
    Object.keys(habit.schedule).filter((schedule, index) => {
        if (!habit.schedule[schedule as ScheduleTypeValue]) {
            unselectedDays.push((index + 1) % 7);
        }
    });
    return unselectedDays;
};

const getMarkedDates = (habit: IHabit, month: string, allDates: string[]) => {
    const getDisabledDates = () => {
        let disabledDates: any = {};

        const start = moment(month).clone().startOf('month').subtract(1, 'month');
        const end = moment(month).clone().endOf('month').add(1, 'month');
        const daysToDisable = getDaysToDisable(habit);

        if (daysToDisable.length >= 0) {
            for (let m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
                if (daysToDisable.includes(m.day())) {
                    const day = m.format('YYYY-MM-DD');

                    disabledDates[day] = {
                        ...markedDates[day],
                        disabled: true,
                    };
                }
            }
        }

        return disabledDates;
    };

    let markedDates = Object.assign(
        {},
        ...allDates
            .filter(
                (date) =>
                    habit.dates[date] &&
                    habit.dates[date].progress >= habit.dates[date].progressTotal
            )
            .map((date) => ({
                [date]: { selected: true, customStyles: { container: { borderRadius: 10 } } },
            }))
    );
    markedDates[today] = { ...markedDates[today], marked: true };
    markedDates = { ...markedDates, ...getDisabledDates() };

    return markedDates;
};

const styles = StyleSheet.create({
    count: {
        height: 45,
        width: 45,
        borderRadius: 5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statBar: {
        position: 'absolute',
        width: 10,
        top: 0,
        bottom: 0,
        left: 0,
    },
    statCard: {
        flex: 1,
        marginRight: 0,
        overflow: 'hidden',
        alignItems: 'center',
    },
    statIconContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    statIconText: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 30,
        paddingLeft: 15,
        textAlign: 'center',
    },

    // paragraph: {
    // 	margin: 24,
    // 	fontSize: 18,
    // 	fontWeight: 'bold',
    // 	textAlign: 'center',
    // },
    // scrollView: {
    // 	height: '20%',
    // 	width: '80%',
    // 	margin: 20,
    // 	alignSelf: 'center',
    // 	padding: 20,
    // 	borderWidth: 5,
    // 	borderRadius: 5,
    // 	borderColor: 'black',
    // 	backgroundColor: 'lightblue',
    // },
    // contentContainer: {
    // 	justifyContent: 'center',
    // 	alignItems: 'center',
    // 	backgroundColor: 'lightgrey',
    // 	paddingBottom: 50,
    // },
});
