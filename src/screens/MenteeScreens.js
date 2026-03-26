/**
 * screens/MenteeScreens.js
 * ──────────────────────────────────────────────────────────────
 * All Mentee screens: Today, Progress, SevaBooks, Profile
 * §6.3, §6.4, §6.5, §6.6
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { StepperControl } from '../components/StepperControl';
import { MoodChipGroup } from '../components/MoodChipGroup';
import { BottomSheet } from '../components/BottomSheet';
import { DateSelector } from '../components/DateSelector';
import { colors, spacing, typography, radius } from '../theme';
import { useTheme } from '../ThemeContext';
import { useToast } from '../components/Toast';
import { MockData } from '../mockData';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { PaginatedScrollView } from '../components/PaginatedScrollView';
import Svg, { Polyline, Polygon, Line, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import {
  Fire,
  Copy,
  CaretRight,
  CaretDown,
  MagnifyingGlass,
  CheckSquare,
  Square,
  X,
  Plus,
  Minus,
  Clock,
  Star,
  CheckCircle,
  ListBullets,
  MusicNotes,
  BookOpenText,
  Leaf,
  Waveform,
  WhatsappLogo,
  Phone,
  EnvelopeSimple,
} from 'phosphor-react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PROGRAMME_ICONS = {
  Fire,
  ListBullets,
  MusicNotes,
  BookOpenText,
  Leaf,
  Waveform,
};

// ═══════════════════════════════════════════════════════════
// Sadhana Scoring Function
// ═══════════════════════════════════════════════════════════

const calculateScore = (config, { japaRounds, japaTarget, morningProgramme, bookEntries, mood, hasSevaToday }) => {
  const roundsScore = Math.min(japaRounds / (japaTarget || 16), 1) * config.roundsWeight;
  const mpDone = morningProgramme.filter(Boolean).length;
  const mpScore = (mpDone / (morningProgramme.length || 1)) * config.morningProgrammeWeight;
  const totalBookMin = bookEntries.reduce((sum, e) => sum + (e.duration || 0), 0);
  const bookScore = Math.min(totalBookMin / (config.bookReadingTargetMinutes || 30), 1) * config.bookReadingWeight;
  const moodMap = { struggling: 0.25, steady: 0.5, inspired: 0.75, blissful: 1.0 };
  const moodScore = (moodMap[mood] || 0.5) * config.moodWeight;
  const sevaScore = hasSevaToday ? config.sevaWeight : 0;
  return Math.round(roundsScore + mpScore + bookScore + moodScore + sevaScore);
};

// ═══════════════════════════════════════════════════════════
// Today Screen (§6.3)
// ═══════════════════════════════════════════════════════════

export const TodayScreen = ({ sadhanaData, sevaLogs: sevaLogsProp } = {}) => {
  const sadhana = sadhanaData || MockData.sadhana;
  const sevaLogsData = sevaLogsProp || MockData.sevaLogs;
  const { colors } = useTheme();
  const showToast = useToast();
  const [japaRounds, setJapaRounds] = useState(sadhana.japaDefault);
  const [morningProgramme, setMorningProgramme] = useState(
    sadhana.morningProgramme.map(item => item.defaultOn)
  );
  const [mood, setMood] = useState(sadhana.defaultMood.toLowerCase());
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bookEntries, setBookEntries] = useState([{ book: MockData.books[0].title, duration: 30 }]);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [preFilled, setPreFilled] = useState(false);
  const bannerHeight = useRef(new Animated.Value(60)).current;
  const bannerOpacity = useRef(new Animated.Value(1)).current;
  const bookSelectorRef = useRef(null);
  const [editingBookIndex, setEditingBookIndex] = useState(null);
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  const [pickerExpanded, setPickerExpanded] = useState({});
  const formOpacity = useRef(new Animated.Value(1)).current;
  const summaryOpacity = useRef(new Animated.Value(0)).current;
  const summaryTranslateY = useRef(new Animated.Value(16)).current;
  const [computedScore, setComputedScore] = useState(0);

  const handleSameAsYesterday = () => {
    setJapaRounds(sadhana.japaDefault);
    setMorningProgramme([false, true, true, false, false, false]);
    setMood('steady');
    setBookEntries([{ book: MockData.books[0].title, duration: 30 }]);
    setPreFilled(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast?.('Pre-filled from yesterday', 'success');
    Animated.parallel([
      Animated.timing(bannerHeight, { toValue: 0, duration: 200, useNativeDriver: false }),
      Animated.timing(bannerOpacity, { toValue: 0, duration: 200, useNativeDriver: false }),
    ]).start(() => setBannerVisible(false));
  };

  const handleToggle = (index) => {
    const newProgramme = [...morningProgramme];
    newProgramme[index] = !newProgramme[index];
    setMorningProgramme(newProgramme);
    Haptics.selectionAsync();
  };

  const handleSubmit = () => {
    const score = calculateScore(MockData.sadhanaScoring, {
      japaRounds,
      japaTarget: sadhana.japaTarget,
      morningProgramme,
      bookEntries,
      mood,
      hasSevaToday: sevaLogsData.some(l => l.date === 'today'),
    });
    setComputedScore(score);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast?.('Sadhana submitted successfully', 'success');
    Animated.timing(formOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setSubmitted(true);
      summaryOpacity.setValue(0);
      summaryTranslateY.setValue(16);
      Animated.parallel([
        Animated.timing(summaryOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(summaryTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleEdit = () => {
    setSubmitted(false);
    formOpacity.setValue(1);
  };

  const addBookEntry = () => {
    setBookEntries([...bookEntries, { book: MockData.books[0].title, duration: 30 }]);
  };

  const removeBookEntry = (index) => {
    setBookEntries(bookEntries.filter((_, i) => i !== index));
  };

  const updateBookDuration = (index, delta) => {
    const newEntries = [...bookEntries];
    newEntries[index].duration = Math.max(0, Math.min(480, newEntries[index].duration + delta));
    setBookEntries(newEntries);
  };

  // B4: Fire icon color — orange when target met
  const japaTargetMet = japaRounds >= sadhana.japaTarget;

  if (submitted) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <Animated.View style={{ opacity: summaryOpacity, transform: [{ translateY: summaryTranslateY }] }}>
          <View style={styles.summaryWithLip}>
            <Card variant="dashboard" style={[styles.summaryCard, { overflow: 'hidden' }]}>
              <Image
                source={require('../../assets/lotus-watercolor.png')}
                style={styles.lotusOverlay}
              />
              <Text style={[styles.summaryScore, { color: colors.primary }]}>{computedScore}</Text>
              <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>SADHANA SCORE</Text>

              <View style={styles.miniDots}>
                {morningProgramme.map((on, i) => (
                  <View key={i} style={[styles.miniDot, { borderColor: colors.border }, on && { backgroundColor: colors.primary, borderColor: colors.primary }]} />
                ))}
              </View>

              <View style={styles.summaryRow}>
                <View style={styles.summaryItemRow}>
                  <Fire size={16} color={japaTargetMet ? colors.primary : colors.text.primary} />
                  <Text style={[styles.summaryItem, { color: colors.text.primary }]}>{japaRounds} Rounds</Text>
                </View>
                <Text style={[styles.summaryDivider, { color: colors.border }]}>|</Text>
                <View style={styles.summaryItemRow}>
                  <View style={[styles.summaryMoodDot, { backgroundColor: colors.mood[mood] }]} />
                  <Text style={[styles.summaryItem, { color: colors.text.primary }]}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</Text>
                </View>
              </View>
            </Card>

            {/* Edit Submission shadow lip */}
            <TouchableOpacity style={styles.editSubmissionLip} onPress={handleEdit} activeOpacity={0.8}>
              <Text style={styles.editSubmissionLipText}>Edit Submission</Text>
            </TouchableOpacity>
          </View>

          {/* Quote of the Day */}
          <Card variant="dashboard" style={styles.quoteCard}>
            <Text style={[styles.quoteText, { color: colors.text.primary }]}>
              "The chanting of the Holy Name of the Lord is able to uproot even the reactions of the greatest sins."
            </Text>
            <Text style={[styles.quoteAttribution, { color: colors.text.secondary }]}>— Srila Prabhupada</Text>
          </Card>
        </Animated.View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Animated.View style={[{ flex: 1 }, { opacity: formOpacity }]}>
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Same as Yesterday Banner */}
          {bannerVisible && (
            <Animated.View style={{ height: bannerHeight, opacity: bannerOpacity, overflow: 'hidden', marginBottom: spacing.md }}>
              <Card variant="banner" onPress={handleSameAsYesterday}>
                <Copy size={20} color={colors.primary} weight="duotone" />
                <Text style={[styles.bannerText, { color: colors.text.primary }]}>Same as yesterday?</Text>
                <CaretRight size={20} color={colors.text.secondary} style={styles.bannerIcon} />
              </Card>
            </Animated.View>
          )}
          {preFilled && (
            <Text style={[styles.preFilledCaption, { color: colors.primary }]}>Pre-filled from yesterday. Tap any field to adjust.</Text>
          )}

          {/* Japa Rounds */}
          <Card variant="form" style={{ alignItems: 'center', overflow: 'hidden' }}>
            <Image
              source={require('../../assets/lotus-watercolor.png')}
              style={styles.lotusOverlay}
            />
            <Text style={[styles.cardTitle, { textAlign: 'center', alignSelf: 'stretch', color: colors.text.primary }]}>Japa Rounds</Text>
            <StepperControl
              value={japaRounds}
              onValueChange={setJapaRounds}
              min={0}
              max={192}
            />
            <Text style={[styles.targetText, { color: colors.text.secondary }]}>Target: {sadhana.japaTarget} rounds</Text>
          </Card>

          {/* Morning Programme */}
          <Card variant="form">
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Morning Programme</Text>
            {sadhana.morningProgramme.map((item, index) => (
              <View key={item.id} style={[
                styles.toggleRow,
                { borderBottomColor: colors.border },
                index === sadhana.morningProgramme.length - 1 && { borderBottomWidth: 0 }
              ]}>
                <View style={styles.toggleIcon}>
                  {PROGRAMME_ICONS[item.icon] && React.createElement(PROGRAMME_ICONS[item.icon], { size: 24, color: colors.text.primary })}
                </View>
                <Text style={[styles.toggleLabel, { color: colors.text.primary }]}>{item.label}</Text>
                <ToggleSwitch
                  value={morningProgramme[index]}
                  onValueChange={() => handleToggle(index)}
                />
              </View>
            ))}
          </Card>

          {/* Book Reading */}
          <Card variant="form">
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>Book Reading</Text>
            {bookEntries.map((entry, index) => (
              <View key={index} style={index > 0 ? [styles.bookEntryBorder, { borderTopColor: colors.border }] : undefined}>
                {index > 0 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeBookEntry(index)}
                  >
                    <X size={18} color={colors.text.secondary} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.bookSelect, { borderColor: colors.border, backgroundColor: colors.surface }, index > 0 && { marginRight: 28 }]}
                  onPress={() => {
                    setEditingBookIndex(index);
                    setBookSearchQuery('');
                    bookSelectorRef.current?.present();
                  }}
                >
                  <Text style={[styles.bookSelectText, { color: colors.text.primary }]} numberOfLines={1}>{entry.book}</Text>
                  <CaretRight size={16} color={colors.text.secondary} />
                </TouchableOpacity>
                <Text style={[styles.durationLabel, { color: colors.text.secondary }]}>Duration</Text>
                <View style={styles.durationStepper}>
                  <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={() => updateBookDuration(index, -5)}
                  >
                    <Minus size={14} color={colors.text.primary} />
                  </TouchableOpacity>
                  <Text style={[styles.durationValue, { color: colors.text.primary }]}>{entry.duration}</Text>
                  <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                    onPress={() => updateBookDuration(index, 5)}
                  >
                    <Plus size={14} color={colors.text.primary} />
                  </TouchableOpacity>
                  <Text style={[styles.unit, { color: colors.text.secondary }]}>min</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity onPress={addBookEntry}>
              <Text style={[styles.addLink, { color: colors.primary }]}>+ Add another book</Text>
            </TouchableOpacity>
          </Card>

          {/* Spiritual Mood */}
          <Card variant="form">
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>How are you feeling?</Text>
            <MoodChipGroup selected={mood} onSelect={setMood} />
          </Card>

          {/* Notes */}
          <Card variant="form">
            <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
              Notes for your Mentor{' '}
              <Text style={[styles.optional, { color: colors.text.secondary }]}>(optional)</Text>
            </Text>
            <TextInput
              style={[styles.notesInput, { borderColor: colors.border, color: colors.text.primary, backgroundColor: colors.surface }]}
              multiline
              placeholder="Share anything on your mind..."
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor={colors.text.secondary}
            />
          </Card>

          {/* B2: Reduced spacer */}
          <View style={{ height: 80 }} />
        </ScrollView>

        {/* Sticky Submit Button */}
        <View style={styles.stickyButtonContainer}>
          <Button variant="primary" onPress={handleSubmit} style={styles.submitButton} textStyle={{ fontFamily: 'SourceSerif4-SemiBold' }}>
            Submit Sadhana
          </Button>
        </View>
      </Animated.View>

      {/* Book selector bottom sheet */}
      <BottomSheet ref={bookSelectorRef} snapPoints={['70%']} title="Select Book">
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MagnifyingGlass size={20} color={colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Search books..."
            value={bookSearchQuery}
            onChangeText={setBookSearchQuery}
            placeholderTextColor={colors.text.secondary}
          />
        </View>
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Standalone books */}
          {MockData.books
            .filter(b => b.title.toLowerCase().includes(bookSearchQuery.toLowerCase()))
            .map((book, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.bookSelectorRow, { borderBottomColor: colors.border }]}
                onPress={() => {
                  if (editingBookIndex !== null) {
                    const newEntries = [...bookEntries];
                    newEntries[editingBookIndex].book = book.title;
                    setBookEntries(newEntries);
                  }
                  bookSelectorRef.current?.dismiss();
                }}
              >
                <Text style={[styles.bookSelectorTitle, { color: colors.text.primary }]}>{book.title}</Text>
              </TouchableOpacity>
            ))}

          {/* Book Collections */}
          {MockData.bookCollections.map((collection) => {
            const matchingVols = collection.volumes.filter(v =>
              v.title.toLowerCase().includes(bookSearchQuery.toLowerCase())
            );
            const nameMatches = collection.name.toLowerCase().includes(bookSearchQuery.toLowerCase());
            if (bookSearchQuery && !nameMatches && matchingVols.length === 0) return null;
            const isExpanded = pickerExpanded[collection.name];
            const vols = bookSearchQuery && !nameMatches ? matchingVols : collection.volumes;

            return (
              <React.Fragment key={collection.name}>
                <TouchableOpacity
                  style={[styles.collectionBand, { backgroundColor: colors.surface }]}
                  onPress={() => setPickerExpanded(prev => ({ ...prev, [collection.name]: !prev[collection.name] }))}
                  activeOpacity={0.7}
                >
                  {isExpanded
                    ? <CaretDown size={18} color={colors.text.secondary} />
                    : <CaretRight size={18} color={colors.text.secondary} />
                  }
                  <Text style={[styles.collectionName, { color: colors.text.primary }]}>{collection.name}</Text>
                  <Text style={[styles.collectionCount, { color: colors.text.secondary }]}>
                    {collection.volumes.length} volumes
                  </Text>
                </TouchableOpacity>
                {isExpanded && vols.map((vol, vIdx) => (
                  <TouchableOpacity
                    key={vIdx}
                    style={[styles.bookSelectorRow, { borderBottomColor: colors.border, paddingLeft: spacing['2xl'] }]}
                    onPress={() => {
                      if (editingBookIndex !== null) {
                        const newEntries = [...bookEntries];
                        newEntries[editingBookIndex].book = vol.title;
                        setBookEntries(newEntries);
                      }
                      bookSelectorRef.current?.dismiss();
                    }}
                  >
                    <Text style={[styles.bookSelectorTitle, { color: colors.text.primary }]}>{vol.title}</Text>
                  </TouchableOpacity>
                ))}
              </React.Fragment>
            );
          })}
        </ScrollView>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
};

// ═══════════════════════════════════════════════════════════
// Progress Screen (§6.4)
// ═══════════════════════════════════════════════════════════

export const ProgressScreen = ({ progressStats: progressStatsProp, submissionHistory: submissionHistoryProp } = {}) => {
  const progressStats = progressStatsProp || MockData.progressStats;
  const submissionHistory = submissionHistoryProp || MockData.submissionHistory;
  const { colors } = useTheme();
  const [timescale, setTimescale] = useState('30');
  const { data: paginatedHistory, hasMore: historyHasMore, loadMore: loadMoreHistory } = usePaginatedList(submissionHistory, { initialCount: 30, pageSize: 10 });
  const [activeTooltip, setActiveTooltip] = useState(null);
  const chartScale = useRef(new Animated.Value(1)).current;
  const chartOpacity = useRef(new Animated.Value(1)).current;

  const tooltips = {
    streak: 'Consecutive days of sadhana submission without a gap.',
    avgScore: 'Mean of your daily sadhana scores over the selected period.',
    sevaHours: 'Total hours of devotional service logged this period.',
  };

  // C2: Fixed chart animation — requestAnimationFrame prevents flicker
  const handleTimescaleChange = (val) => {
    if (val === timescale) return;
    const zoomingIn = parseInt(val) < parseInt(timescale);
    Animated.parallel([
      Animated.timing(chartScale, { toValue: zoomingIn ? 0.92 : 1.08, duration: 120, useNativeDriver: true }),
      Animated.timing(chartOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      chartScale.setValue(zoomingIn ? 1.08 : 0.92);
      setTimescale(val);
      setActiveTooltip(null);
      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.spring(chartScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 10 }),
          Animated.timing(chartOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
      });
    });
  };

  // Filter data by timescale
  const timeFilteredData = submissionHistory.slice(0, parseInt(timescale));
  const chartData = timeFilteredData.slice().reverse();

  // Dynamic y-axis
  const scores = chartData.map(d => d.score);
  const minScore = Math.min(...scores);
  const yMin = Math.max(0, Math.floor((minScore - 10) / 5) * 5);
  const yMax = 100;
  const yLabels = Array.from({ length: 5 }, (_, i) =>
    Math.round(yMin + ((yMax - yMin) * (4 - i)) / 4)
  );

  const statChips = [
    { key: 'streak', Icon: Fire, iconColor: colors.primary, value: progressStats.streak, label: 'Streak' },
    { key: 'avgScore', Icon: Star, iconColor: colors.text.primary, value: progressStats.avgScore, label: 'Avg Score' },
    { key: 'sevaHours', Icon: Clock, iconColor: colors.text.primary, value: progressStats.sevaHours, label: 'Seva Hrs' },
  ];

  // C5: Smooth tooltip animation
  const handleTooltipToggle = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  return (
    // C1: No outer scroll — use plain View
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg, paddingBottom: 0 }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.screenTitle, { marginBottom: 0, color: colors.text.primary }]}>Progress</Text>
        <View style={[styles.timescaleSelect, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {['7', '30', '90'].map((val) => (
            <TouchableOpacity
              key={val}
              style={[styles.timescaleOption, timescale === val && { backgroundColor: colors.accent.peach }]}
              onPress={() => handleTimescaleChange(val)}
            >
              <Text style={[styles.timescaleText, { color: colors.text.secondary }, timescale === val && { color: colors.primary, fontWeight: '600' }]}>
                {val}d
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chart with zoom animation */}
      <Animated.View style={{ opacity: chartOpacity, transform: [{ scaleX: chartScale }] }}>
        <Card variant="dashboard" style={{ position: 'relative' }}>
          {(() => {
            const data = chartData;
            const chartW = 280;
            const chartH = 120;
            const padL = 32;
            const padR = 8;
            const padT = 8;
            const padB = 24;
            const plotW = chartW - padL - padR;
            const plotH = chartH - padT - padB;
            const points = data.map((d, i) => {
              const x = padL + (i / Math.max(data.length - 1, 1)) * plotW;
              const y = padT + plotH - ((d.score - yMin) / (yMax - yMin)) * plotH;
              return `${x},${y}`;
            });
            const polyPoints = points.join(' ');
            const firstX = padL;
            const lastX = padL + plotW;
            const polygonPoints = `${polyPoints} ${lastX},${padT + plotH} ${firstX},${padT + plotH}`;
            const gridYs = yLabels.map(v => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH);

            return (
              <Svg width={chartW} height={chartH} style={{ alignSelf: 'center' }}>
                <Defs>
                  <SvgLinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={colors.primary} stopOpacity="0.3" />
                    <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
                  </SvgLinearGradient>
                </Defs>
                {gridYs.map((y, i) => (
                  <Line key={i} x1={padL} y1={y} x2={padL + plotW} y2={y}
                    stroke={colors.border} strokeWidth={1} strokeDasharray="4,4" />
                ))}
                <Polygon points={polygonPoints} fill="url(#chartGrad)" />
                <Polyline points={polyPoints} fill="none" stroke={colors.primary} strokeWidth={2} />
              </Svg>
            );
          })()}
          <View style={styles.yLabelsOverlay}>
            {yLabels.map((val) => (
              <Text key={val} style={[styles.yLabel, { color: colors.text.secondary }]}>{val}</Text>
            ))}
          </View>
        </Card>
      </Animated.View>

      {/* Stats Row — tap shows animated popdown */}
      <View style={styles.statsRow}>
        {statChips.map((stat) => (
          <TouchableOpacity
            key={stat.key}
            style={[styles.statChip, { backgroundColor: colors.accent.peach }]}
            onPress={() => handleTooltipToggle(stat.key)}
          >
            <View style={styles.statValue}>
              <stat.Icon size={16} color={stat.iconColor} weight="fill" />
              <Text style={[styles.statNumber, { color: colors.text.primary }]}>{stat.value}</Text>
            </View>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>{stat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTooltip && (
        <View style={[styles.tooltipPopdown, { backgroundColor: colors.accent.peach, borderColor: colors.border }]}>
          <Text style={[styles.tooltipText, { color: colors.text.secondary }]}>{tooltips[activeTooltip]}</Text>
        </View>
      )}

      {/* History — fixed header + scrollable data, flex fills remaining space, capped at 4 visible rows */}
      <View style={{ flex: 1 }}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>History</Text>
        <View style={[styles.historyContainer, { borderColor: colors.border, backgroundColor: colors.surface, flex: 1, maxHeight: 216 }]}>
          {/* Fixed header */}
          <View style={[styles.historyHeader, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
            {/* C4: Centered date header */}
            <Text style={[styles.historyHeaderText, { flex: 1, textAlign: 'center', color: colors.text.secondary }]}>Date</Text>
            <Text style={[styles.historyHeaderText, { width: 52, textAlign: 'center', color: colors.text.secondary }]}>Score</Text>
            <Text style={[styles.historyHeaderText, { width: 64, textAlign: 'center', color: colors.text.secondary }]}>Mood</Text>
            {/* C3: Full "Progress" header */}
            <Text style={[styles.historyHeaderText, { width: 80, textAlign: 'center', color: colors.text.secondary }]}>Progress</Text>
          </View>
          {/* Scrollable rows with pagination */}
          <PaginatedScrollView nestedScrollEnabled style={{ flex: 1 }} hasMore={historyHasMore} onLoadMore={loadMoreHistory}>
            {paginatedHistory.slice(0, parseInt(timescale)).map((entry, index) => (
              <View key={index} style={[
                styles.historyRow,
                { borderBottomColor: colors.border },
                index === paginatedHistory.slice(0, parseInt(timescale)).length - 1 && { borderBottomWidth: 0 }
              ]}>
                <View style={styles.historyDate}>
                  <View style={[styles.moodDot, { backgroundColor: colors.mood[entry.mood] }]} />
                  <Text style={[styles.historyDateText, { color: colors.text.primary }]}>{entry.date}</Text>
                </View>
                <Text style={[styles.historyScore, { color: colors.text.primary }]}>{entry.score}</Text>
                <Text style={[styles.historyMood, { color: colors.text.secondary }]} numberOfLines={1}>{entry.mood}</Text>
                {/* C3: Centered dots, width 80 */}
                <View style={[styles.historyDots, { width: 80 }]}>
                  {entry.mp.map((on, i) => (
                    <View key={i} style={[styles.historyMiniDot, { borderColor: colors.border }, on && { backgroundColor: colors.primary, borderColor: colors.primary }]} />
                  ))}
                </View>
              </View>
            ))}
          </PaginatedScrollView>
        </View>
      </View>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// SevaBooks Screen (§6.5)
// ═══════════════════════════════════════════════════════════

export const SevaBooksScreen = ({ sevaLogs: sevaLogsProp, books: booksProp, bookCollections: bookCollectionsProp, courses: coursesProp } = {}) => {
  const sevaLogsForDisplay = sevaLogsProp || MockData.sevaLogs;
  const booksSource = booksProp || MockData.books;
  const collectionsSource = bookCollectionsProp || MockData.bookCollections;
  const coursesSource = coursesProp || MockData.courses;
  const { colors } = useTheme();
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState('seva');
  const [bookSearch, setBookSearch] = useState('');
  const [books, setBooks] = useState(booksSource.map(b => ({ ...b })));
  const [collections, setCollections] = useState(
    collectionsSource.map(c => ({ ...c, volumes: c.volumes.map(v => ({ ...v })) }))
  );
  const [expandedCollections, setExpandedCollections] = useState({});
  const [sevaDept, setSevaDept] = useState('');
  const [sevaDesc, setSevaDesc] = useState('');
  const [sevaDuration, setSevaDuration] = useState(1);
  const [sevaDate, setSevaDate] = useState(new Date());
  const [courseName, setCourseName] = useState('');
  const [courseIsOther, setCourseIsOther] = useState(false);
  const [courseNotes, setCourseNotes] = useState('');
  const [courseDate, setCourseDate] = useState(new Date());
  const courseOptions = (MockData.adminSettingsLists?.['Courses'] || []).filter(c => c.active).map(c => c.name);
  const bottomSheetRef = useRef(null);
  const courseSheetRef = useRef(null);
  // D3: Fade animation for sub-tab switching
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const toggleBookOwned = (index) => {
    const newBooks = [...books];
    newBooks[index] = { ...newBooks[index], owned: !newBooks[index].owned };
    setBooks(newBooks);
  };

  const cycleBookStatus = (index) => {
    const newBooks = [...books];
    const statuses = ['not-started', 'reading', 'completed'];
    const currentIndex = statuses.indexOf(newBooks[index].status);
    newBooks[index] = { ...newBooks[index], status: statuses[(currentIndex + 1) % 3] };
    setBooks(newBooks);
  };

  const toggleCollection = (name) => {
    setExpandedCollections(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleVolumeOwned = (collectionName, volumeIdx) => {
    setCollections(prev => prev.map(c =>
      c.name === collectionName
        ? { ...c, volumes: c.volumes.map((v, i) => i === volumeIdx ? { ...v, owned: !v.owned } : v) }
        : c
    ));
  };

  const cycleVolumeStatus = (collectionName, volumeIdx) => {
    const statuses = ['not-started', 'reading', 'completed'];
    setCollections(prev => prev.map(c =>
      c.name === collectionName
        ? { ...c, volumes: c.volumes.map((v, i) => {
            if (i !== volumeIdx) return v;
            const cur = statuses.indexOf(v.status);
            return { ...v, status: statuses[(cur + 1) % 3] };
          }) }
        : c
    ));
  };

  const filteredBooks = books
    .filter(b => b.title.toLowerCase().includes(bookSearch.toLowerCase()))
    .sort((a, b) => {
      if (a.owned && !b.owned) return -1;
      if (!a.owned && b.owned) return 1;
      if (a.owned && b.owned) {
        const statusOrder = { 'reading': 0, 'completed': 1, 'not-started': 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
      }
      return a.title.localeCompare(b.title);
    });

  const openSevaLog = () => {
    bottomSheetRef.current?.present();
  };

  // D3: Smooth tab change with fade
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    Animated.timing(contentOpacity, {
      toValue: 0, duration: 150, useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(contentOpacity, {
        toValue: 1, duration: 200, useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.screenTitle, { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, color: colors.text.primary }]}>Seva & Books</Text>

      {/* Sub Tabs */}
      <View style={[styles.subTabStrip, { marginHorizontal: spacing.lg, borderBottomColor: colors.border }]}>
        {['seva', 'books', 'courses'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.subTab, activeTab === tab && { borderBottomWidth: 2, borderBottomColor: colors.primary }]}
            onPress={() => handleTabChange(tab)}
          >
            <Text style={[styles.subTabText, { color: colors.text.secondary }, activeTab === tab && { color: colors.primary, fontWeight: '600' }]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* D3: Animated content fade */}
      <Animated.View style={{ opacity: contentOpacity, flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          {activeTab === 'seva' && (
            <>
              <Button variant="secondary" onPress={openSevaLog} style={styles.actionButton}>
                + Log Seva
              </Button>
              {sevaLogsForDisplay.map((log, index) => (
                <Card key={index} variant="form" style={styles.sevaCard}>
                  <View style={styles.sevaHeader}>
                    <Text style={[styles.sevaDate, { color: colors.text.primary }]}>{log.date}</Text>
                    <Text style={[styles.sevaHours, { color: colors.text.primary }]}>{log.hours} hrs</Text>
                  </View>
                  <View style={[styles.departmentChip, { backgroundColor: colors.accent.peach }]}>
                    <Text style={[styles.departmentText, { color: colors.primaryPressed }]}>{log.department.toUpperCase()}</Text>
                  </View>
                  <Text style={[styles.sevaDescription, { color: colors.text.secondary }]}>{log.description}</Text>
                </Card>
              ))}
            </>
          )}

          {activeTab === 'books' && (
            <>
              <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <MagnifyingGlass size={20} color={colors.text.secondary} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text.primary }]}
                  placeholder="Search Prabhupada books..."
                  value={bookSearch}
                  onChangeText={setBookSearch}
                  placeholderTextColor={colors.text.secondary}
                />
              </View>

              {/* Standalone books */}
              {filteredBooks.map((book) => (
                <View key={book.title} style={[styles.bookRow, { borderBottomColor: colors.border }]}>
                  <View style={styles.bookInfo}>
                    <Text style={[styles.bookTitle, { color: colors.text.primary }]}>{book.title}</Text>
                    <TouchableOpacity
                      style={styles.ownedToggle}
                      onPress={() => {
                        const realIdx = books.findIndex(b => b.title === book.title);
                        if (realIdx !== -1) toggleBookOwned(realIdx);
                      }}
                    >
                      {book.owned ? (
                        <CheckSquare size={16} color={colors.text.primary} weight="fill" />
                      ) : (
                        <Square size={16} color={colors.text.secondary} />
                      )}
                      <Text style={[styles.ownedText, { color: colors.text.primary }, !book.owned && { color: colors.text.secondary, opacity: 0.4 }]}>
                        {book.owned ? 'Owned' : 'Not owned'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.statusChip, { borderColor: colors.border },
                      book.status === 'reading' && { backgroundColor: `${colors.status.warning}20`, borderColor: colors.status.warning },
                      book.status === 'completed' && { backgroundColor: `${colors.status.success}20`, borderColor: colors.status.success },
                    ]}
                    onPress={() => {
                      const realIdx = books.findIndex(b => b.title === book.title);
                      if (realIdx !== -1) cycleBookStatus(realIdx);
                    }}
                  >
                    <Text style={[styles.statusText, { color: colors.text.primary }]}>
                      {book.status === 'not-started' ? 'Not Started' :
                       book.status === 'reading' ? 'Reading' : 'Completed'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Book Collections */}
              {collections.map((collection) => {
                const matchingVolumes = collection.volumes.filter(v =>
                  v.title.toLowerCase().includes(bookSearch.toLowerCase())
                );
                const nameMatches = collection.name.toLowerCase().includes(bookSearch.toLowerCase());
                if (bookSearch && !nameMatches && matchingVolumes.length === 0) return null;
                const isExpanded = expandedCollections[collection.name];
                const volumesToShow = bookSearch && !nameMatches ? matchingVolumes : collection.volumes;

                return (
                  <React.Fragment key={collection.name}>
                    <TouchableOpacity
                      style={[styles.collectionBand, { backgroundColor: colors.surface }]}
                      onPress={() => toggleCollection(collection.name)}
                      activeOpacity={0.7}
                    >
                      {isExpanded
                        ? <CaretDown size={18} color={colors.text.secondary} />
                        : <CaretRight size={18} color={colors.text.secondary} />
                      }
                      <Text style={[styles.collectionName, { color: colors.text.primary }]}>{collection.name}</Text>
                      <Text style={[styles.collectionCount, { color: colors.text.secondary }]}>
                        {collection.volumes.length} volumes
                      </Text>
                    </TouchableOpacity>
                    {isExpanded && volumesToShow.map((vol, vIdx) => (
                      <View key={vol.title} style={[styles.bookRow, styles.volumeRow, { borderBottomColor: colors.border }]}>
                        <View style={styles.bookInfo}>
                          <Text style={[styles.bookTitle, { color: colors.text.primary }]}>{vol.title}</Text>
                          <TouchableOpacity
                            style={styles.ownedToggle}
                            onPress={() => toggleVolumeOwned(collection.name, collection.volumes.indexOf(vol))}
                          >
                            {vol.owned ? (
                              <CheckSquare size={16} color={colors.text.primary} weight="fill" />
                            ) : (
                              <Square size={16} color={colors.text.secondary} />
                            )}
                            <Text style={[styles.ownedText, { color: colors.text.primary }, !vol.owned && { color: colors.text.secondary, opacity: 0.4 }]}>
                              {vol.owned ? 'Owned' : 'Not owned'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.statusChip, { borderColor: colors.border },
                            vol.status === 'reading' && { backgroundColor: `${colors.status.warning}20`, borderColor: colors.status.warning },
                            vol.status === 'completed' && { backgroundColor: `${colors.status.success}20`, borderColor: colors.status.success },
                          ]}
                          onPress={() => cycleVolumeStatus(collection.name, collection.volumes.indexOf(vol))}
                        >
                          <Text style={[styles.statusText, { color: colors.text.primary }]}>
                            {vol.status === 'not-started' ? 'Not Started' :
                             vol.status === 'reading' ? 'Reading' : 'Completed'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </React.Fragment>
                );
              })}
            </>
          )}

          {activeTab === 'courses' && (
            <>
              <Button variant="secondary" style={styles.actionButton} onPress={() => courseSheetRef.current?.present()}>
                + Submit Course
              </Button>
              {coursesSource.map((course, index) => (
                <View key={index} style={[styles.courseRow, { borderBottomColor: colors.border }]}>
                  <View>
                    <Text style={[styles.courseName, { color: colors.text.primary }]}>{course.name}</Text>
                    <Text style={[styles.courseDate, { color: colors.text.secondary }]}>Submitted: {course.submitted}</Text>
                  </View>
                  {course.status === 'approved' ? (
                    <CheckCircle size={24} color={colors.status.success} weight="fill" />
                  ) : (
                    <Clock size={24} color={colors.status.warning} weight="fill" />
                  )}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </Animated.View>

      <BottomSheet ref={bottomSheetRef} snapPoints={['80%']} title="Log Seva">
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Department</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll}>
            {(MockData.adminSettingsLists['Service Departments'] || []).filter(d => d.active).map((dept) => (
              <TouchableOpacity
                key={dept.name}
                style={[styles.deptChip, { backgroundColor: colors.surface, borderColor: colors.border }, sevaDept === dept.name && { backgroundColor: colors.accent.peach, borderColor: colors.primary }]}
                onPress={() => setSevaDept(dept.name)}
              >
                <Text style={[styles.deptChipText, { color: colors.text.secondary }, sevaDept === dept.name && { color: colors.primary, fontWeight: '600' }]}>
                  {dept.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Description</Text>
          <TextInput
            style={[styles.sheetTextarea, { borderColor: colors.border, color: colors.text.primary }]}
            multiline
            placeholder="What did you do?"
            value={sevaDesc}
            onChangeText={setSevaDesc}
            placeholderTextColor={colors.text.secondary}
          />
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Duration (hours)</Text>
          <View style={{ alignItems: 'center', marginVertical: spacing.sm }}>
            <StepperControl value={sevaDuration} onValueChange={setSevaDuration} min={0.5} max={24} step={0.5} />
          </View>
          {/* D2: Date selector */}
          <Text style={[styles.sheetLabel, { marginTop: spacing.md, color: colors.text.secondary }]}>Date</Text>
          <DateSelector value={sevaDate} onChange={setSevaDate} />
          <Button variant="primary" style={{ marginTop: spacing.xl }} onPress={() => {
            showToast?.('Seva logged successfully', 'success');
            bottomSheetRef.current?.dismiss();
          }}>
            Log Seva
          </Button>
        </ScrollView>
      </BottomSheet>

      <BottomSheet ref={courseSheetRef} snapPoints={['80%']} title="Submit Course">
        <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Course</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll}>
          {courseOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.deptChip, { backgroundColor: colors.surface, borderColor: colors.border }, courseName === opt && !courseIsOther && { backgroundColor: colors.accent.peach, borderColor: colors.primary }]}
              onPress={() => { setCourseName(opt); setCourseIsOther(false); }}
            >
              <Text style={[styles.deptChipText, { color: colors.text.secondary }, courseName === opt && !courseIsOther && { color: colors.primary, fontWeight: '600' }]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.deptChip, { backgroundColor: colors.surface, borderColor: colors.border }, courseIsOther && { backgroundColor: colors.accent.peach, borderColor: colors.primary }]}
            onPress={() => { setCourseIsOther(true); setCourseName(''); }}
          >
            <Text style={[styles.deptChipText, { color: colors.text.secondary }, courseIsOther && { color: colors.primary, fontWeight: '600' }]}>
              Other
            </Text>
          </TouchableOpacity>
        </ScrollView>
        {courseIsOther && (
          <>
            <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Course Name</Text>
            <TextInput
              style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]}
              placeholder="Enter course name..."
              value={courseName}
              onChangeText={setCourseName}
              placeholderTextColor={colors.text.secondary}
            />
          </>
        )}
        {/* D2: Date selector for course */}
        <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Completion Date</Text>
        <DateSelector value={courseDate} onChange={setCourseDate} />
        <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Notes</Text>
        <TextInput
          style={[styles.sheetTextarea, { borderColor: colors.border, color: colors.text.primary }]}
          multiline
          placeholder="Any additional notes..."
          value={courseNotes}
          onChangeText={setCourseNotes}
          placeholderTextColor={colors.text.secondary}
        />
        <Button variant="primary" style={{ marginTop: spacing.xl }} onPress={() => {
          showToast?.('Course submitted for review', 'success');
          courseSheetRef.current?.dismiss();
        }}>
          Submit
        </Button>
      </BottomSheet>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// Profile Screen (§6.6)
// ═══════════════════════════════════════════════════════════

export const ProfileScreen = ({ onLogout }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const showToast = useToast();
  const profile = MockData.menteeProfile;
  const profileSheetRef = useRef(null);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editJapaTarget, setEditJapaTarget] = useState(profile.japaTarget);
  const [editInitiatedName, setEditInitiatedName] = useState(profile.initiatedName || '');
  const [editSpiritualMaster, setEditSpiritualMaster] = useState(profile.spiritualMaster || '');
  const [editDob, setEditDob] = useState(profile.dob || '');
  const [editAddress, setEditAddress] = useState(profile.address || '');
  const [editInitiationYear, setEditInitiationYear] = useState(profile.initiationYear || '');
  const [smPickerOpen, setSmPickerOpen] = useState(false);
  const spiritualMasters = (MockData.adminSettingsLists?.['Spiritual Masters'] || []).filter(sm => sm.active).map(sm => sm.name);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={[styles.avatarText, { color: colors.surface }]}>BJ</Text>
          </View>
          <Text style={[styles.profileName, { color: colors.text.primary }]}>{profile.name}</Text>
          <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>{profile.email}</Text>
          <Text style={[styles.profilePhone, { color: colors.text.secondary }]}>{profile.phone}</Text>
        </View>

        <View style={styles.profileDetails}>
          {/* Dark Mode Toggle */}
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Dark Mode</Text>
            <ToggleSwitch value={isDark} onValueChange={toggleTheme} />
          </View>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Date Joined</Text>
            <Text style={[styles.detailValue, { color: colors.text.primary }]}>{profile.dateJoined}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Initiated</Text>
            <Text style={[styles.detailValue, { color: colors.text.secondary }]}>
              {profile.initiatedName || 'Not yet initiated'}
            </Text>
          </View>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Spiritual Master</Text>
            <Text style={[styles.detailValue, { color: colors.text.secondary }]}>
              {profile.spiritualMaster || 'Not applicable'}
            </Text>
          </View>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Japa Target</Text>
            <Text style={[styles.detailValue, { color: colors.text.primary }]}>{profile.japaTarget} rounds</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Date of Birth</Text>
            <Text style={[styles.detailValue, { color: colors.text.primary }]}>{profile.dob || 'Not set'}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Address</Text>
            <Text style={[styles.detailValue, { color: colors.text.primary }]} numberOfLines={2}>{profile.address || 'Not set'}</Text>
          </View>
          {profile.initiationYear && (
            <View style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>Initiation Year</Text>
              <Text style={[styles.detailValue, { color: colors.text.primary }]}>{profile.initiationYear}</Text>
            </View>
          )}
        </View>

        {/* My Mentor contact card */}
        {profile.mentor && (
          <Card variant="dashboard" style={{ marginBottom: spacing.md }}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary, marginBottom: spacing.sm }]}>My Mentor</Text>
            <Text style={[styles.detailValue, { color: colors.text.primary, marginBottom: spacing.sm }]}>{profile.mentor.name}</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <TouchableOpacity
                style={[styles.contactChip, { backgroundColor: `${colors.status.success}15` }]}
                onPress={() => Linking.openURL(`https://wa.me/${profile.mentor.phone.replace(/[^0-9+]/g, '')}`)}
              >
                <WhatsappLogo size={16} color={colors.status.success} weight="fill" />
                <Text style={[styles.contactChipText, { color: colors.status.success }]}>WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactChip, { backgroundColor: `${colors.primary}15` }]}
                onPress={() => Linking.openURL(`tel:${profile.mentor.phone}`)}
              >
                <Phone size={16} color={colors.primary} weight="fill" />
                <Text style={[styles.contactChipText, { color: colors.primary }]}>Phone</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactChip, { backgroundColor: `${colors.primary}15` }]}
                onPress={() => Linking.openURL(`mailto:${profile.mentor.email}`)}
              >
                <EnvelopeSimple size={16} color={colors.primary} weight="fill" />
                <Text style={[styles.contactChipText, { color: colors.primary }]}>Email</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        <Button variant="secondary" style={styles.profileButton} onPress={() => profileSheetRef.current?.present()}>
          Edit Profile
        </Button>
        <Button variant="destructive" onPress={onLogout}>
          Log Out
        </Button>
      </ScrollView>

      <BottomSheet ref={profileSheetRef} snapPoints={['90%']} title="Edit Profile">
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Name</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={editName} onChangeText={setEditName} placeholderTextColor={colors.text.secondary} />
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Email</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={editEmail} onChangeText={setEditEmail} placeholderTextColor={colors.text.secondary} keyboardType="email-address" />
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Phone</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={editPhone} onChangeText={setEditPhone} placeholderTextColor={colors.text.secondary} keyboardType="phone-pad" />
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Japa Target</Text>
          {/* E1: Center the stepper to prevent clipping */}
          <View style={{ alignItems: 'center', marginVertical: spacing.sm }}>
            <StepperControl value={editJapaTarget} onValueChange={setEditJapaTarget} min={1} max={192} />
          </View>
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Initiated Name</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={editInitiatedName} onChangeText={setEditInitiatedName} placeholder="Not yet initiated" placeholderTextColor={colors.text.secondary} />
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Initiation Year</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={String(editInitiationYear || '')} onChangeText={setEditInitiationYear} placeholder="e.g. 2020" placeholderTextColor={colors.text.secondary} keyboardType="number-pad" />
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Spiritual Master</Text>
          <TouchableOpacity
            style={[styles.sheetInput, { borderColor: colors.border, justifyContent: 'center' }]}
            onPress={() => setSmPickerOpen(v => !v)}
          >
            <Text style={{ ...typography.body, color: editSpiritualMaster ? colors.text.primary : colors.text.secondary }}>
              {editSpiritualMaster || 'Select spiritual master...'}
            </Text>
          </TouchableOpacity>
          {smPickerOpen && (
            <View style={{ borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, marginBottom: spacing.md, overflow: 'hidden' }}>
              {spiritualMasters.map((sm, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={{ padding: spacing.md, borderBottomWidth: idx < spiritualMasters.length - 1 ? 1 : 0, borderBottomColor: colors.border, backgroundColor: editSpiritualMaster === sm ? colors.accent.peach : 'transparent' }}
                  onPress={() => { setEditSpiritualMaster(sm); setSmPickerOpen(false); }}
                >
                  <Text style={{ ...typography.body, color: colors.text.primary }}>{sm}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={{ padding: spacing.md, backgroundColor: editSpiritualMaster && !spiritualMasters.includes(editSpiritualMaster) ? colors.accent.peach : 'transparent' }}
                onPress={() => { setEditSpiritualMaster(''); setSmPickerOpen(false); }}
              >
                <Text style={{ ...typography.body, color: colors.text.secondary }}>Other (type below)</Text>
              </TouchableOpacity>
            </View>
          )}
          {smPickerOpen === false && editSpiritualMaster && !spiritualMasters.includes(editSpiritualMaster) && (
            <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={editSpiritualMaster} onChangeText={setEditSpiritualMaster} placeholder="Enter spiritual master name" placeholderTextColor={colors.text.secondary} />
          )}
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Date of Birth</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary }]} value={editDob} onChangeText={setEditDob} placeholder="e.g. 15 March 1995" placeholderTextColor={colors.text.secondary} />
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Address</Text>
          <TextInput style={[styles.sheetInput, { borderColor: colors.border, color: colors.text.primary, height: 64, textAlignVertical: 'top' }]} value={editAddress} onChangeText={setEditAddress} placeholder="Home address" placeholderTextColor={colors.text.secondary} multiline />
          <Text style={[styles.sheetLabel, { color: colors.text.secondary }]}>Date Joined</Text>
          <Text style={[styles.sheetDateText, { color: colors.text.primary }]}>{profile.dateJoined}</Text>
          <Button variant="primary" style={{ marginTop: spacing.xl }} onPress={() => {
            showToast?.('Profile saved!', 'success');
            profileSheetRef.current?.dismiss();
          }}>
            Save Changes
          </Button>
          <View style={{ height: 40 }} />
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

// ═══════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 100,
  },

  // Screen titles
  screenTitle: {
    ...typography.title,
    marginBottom: spacing.md,
  },

  // Today Screen
  bannerText: {
    ...typography.body,
    marginLeft: spacing.sm,
    flex: 1,
  },
  bannerIcon: {
    marginLeft: 'auto',
  },
  preFilledCaption: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  targetText: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  toggleIcon: {
    width: 24,
    marginRight: spacing.md,
  },
  toggleLabel: {
    ...typography.body,
    flex: 1,
  },
  bookEntryBorder: {
    borderTopWidth: 1,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 0,
    zIndex: 1,
  },
  bookSelect: {
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookSelectText: {
    ...typography.body,
    flex: 1,
  },
  bookSelectorRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
  },
  bookSelectorTitle: {
    ...typography.body,
  },
  durationLabel: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  durationStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  smallButton: {
    width: 36,
    height: 36,
    borderRadius: radius.circle,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationValue: {
    ...typography.subtitle,
    minWidth: 50,
    textAlign: 'center',
  },
  unit: {
    ...typography.caption,
  },
  addLink: {
    ...typography.body,
    marginTop: spacing.md,
  },
  optional: {
    ...typography.body,
    fontSize: 13,
    fontWeight: '400',
  },
  notesInput: {
    minHeight: 88,
    borderRadius: radius.sm,
    borderWidth: 1,
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 88,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    zIndex: 10,
  },
  submitButton: {
    width: '100%',
  },

  // Summary state
  summaryWithLip: {
    marginBottom: spacing.sm,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  editSubmissionLip: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
  },
  editSubmissionLipText: {
    color: colors.surface,
    fontFamily: 'DMSans-SemiBold',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  lotusOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'cover',
    opacity: 0.1,
  },
  summaryScore: {
    ...typography.metric,
  },
  summaryLabel: {
    ...typography.overline,
    marginTop: spacing.sm,
  },
  miniDots: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginVertical: spacing.lg,
  },
  miniDot: {
    width: 8,
    height: 8,
    borderRadius: radius.circle,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  miniDotFilled: {
    // Colors applied inline
  },
  historyMiniDot: {
    width: 6,
    height: 6,
    borderRadius: radius.circle,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryItem: {
    ...typography.body,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryDivider: {
  },
  summaryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  summaryMoodDot: {
    width: 10,
    height: 10,
    borderRadius: radius.circle,
  },
  quoteCard: {
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  quoteText: {
    fontFamily: 'SourceSerif4-Regular',
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  quoteAttribution: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: radius.circle,
    marginRight: 4,
  },

  // Progress Screen
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timescaleSelect: {
    flexDirection: 'row',
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  timescaleOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timescaleText: {
    ...typography.caption,
  },
  yLabelsOverlay: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.sm,
    bottom: spacing.lg + 24,
    justifyContent: 'space-between',
  },
  yLabel: {
    ...typography.caption,
    fontSize: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  statChip: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statNumber: {
    ...typography.subtitle,
  },
  statLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },
  tooltipPopdown: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  tooltipText: {
    ...typography.caption,
    fontSize: 12,
    textAlign: 'center',
  },
  historyContainer: {
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  historyHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  historyHeaderText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  historyDate: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  historyDateText: {
    ...typography.body,
    fontSize: 13,
    fontWeight: '500',
  },
  historyScore: {
    width: 52,
    ...typography.bodyBold,
    textAlign: 'center',
  },
  historyMood: {
    width: 64,
    ...typography.caption,
    textAlign: 'center',
    textTransform: 'capitalize',
    fontSize: 10,
  },
  // C3: Centered dots, width 80
  historyDots: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },

  // SevaBooks Screen
  subTabStrip: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: spacing.md,
  },
  subTab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  subTabText: {
    ...typography.body,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  sevaCard: {
    marginBottom: spacing.md,
  },
  sevaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sevaDate: {
    ...typography.body,
  },
  sevaHours: {
    ...typography.bodyBold,
  },
  departmentChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginBottom: spacing.xs,
  },
  departmentText: {
    ...typography.caption,
    fontWeight: '600',
  },
  sevaDescription: {
    ...typography.caption,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: spacing.sm,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  collectionBand: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  collectionName: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
    marginLeft: spacing.sm,
  },
  collectionCount: {
    ...typography.caption,
  },
  volumeRow: {
    marginLeft: spacing.xl,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    ...typography.body,
    marginBottom: spacing.xs,
  },
  ownedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ownedText: {
    ...typography.caption,
  },
  statusChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '500',
  },
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  courseName: {
    ...typography.bodyBold,
  },
  courseDate: {
    ...typography.caption,
  },

  // Profile Screen
  profileHeader: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.circle,
    backgroundColor: colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
  },
  profileName: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.body,
  },
  profilePhone: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  profileDetails: {
    marginBottom: spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  detailLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  detailValue: {
    ...typography.body,
  },
  profileButton: {
    marginBottom: spacing.sm,
  },

  // Bottom Sheet Forms
  sheetLabel: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sheetInput: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
  },
  sheetTextarea: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sheetDateText: {
    ...typography.body,
    paddingVertical: spacing.sm,
  },
  deptScroll: {
    marginBottom: spacing.sm,
  },
  // D1: Reduced vertical padding for department chips
  deptChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  deptChipText: {
    ...typography.caption,
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  contactChipText: {
    ...typography.caption,
    fontWeight: '600',
  },
});
