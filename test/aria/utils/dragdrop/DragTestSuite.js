/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Test suite regrouping all tests on the Drag utility
 */
Aria.classDefinition({
    $classpath : 'test.aria.utils.dragdrop.DragTestSuite',
    $extends : 'aria.jsunit.TestSuite',
    $constructor : function () {
        this.$TestSuite.constructor.call(this);

        this.addTests("test.aria.utils.dragdrop.ScrollIntoViewThenDragRobotTestCase");
        this.addTests("test.aria.utils.dragdrop.DragErrorTestCase");
        this.addTests("test.aria.utils.dragdrop.DragBasicRobotTestCase");
        this.addTests("test.aria.utils.dragdrop.DragConstraintRobotTestCase");
        this.addTests("test.aria.utils.dragdrop.OutOfBoundaryRobotTestCase");
        this.addTests("test.aria.utils.dragdrop.DragProxyRobotTestCase");
        this.addTests("test.aria.utils.dragdrop.DragDropBeanTestCase");
        this.addTests("test.aria.utils.dragdrop.issue397.MovableScrollbarRobotTestCase");
        this.addTests("test.aria.utils.dragdrop.fixedElements.FixedElementRobotTestCase");

    }
});
